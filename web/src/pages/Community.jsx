import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Trash2, Send, Plus, X } from 'lucide-react';
import { communityService } from '../services/communityService';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = [
    { id: 'all', label: 'All Posts', icon: '📱', color: 'gray' },
    { id: 'tip', label: 'Tips', icon: '💡', color: 'green' },
    { id: 'question', label: 'Questions', icon: '❓', color: 'blue' },
    { id: 'success', label: 'Success Stories', icon: '🌟', color: 'purple' },
    { id: 'general', label: 'General', icon: '💬', color: 'gray' }
];

const getCategoryColor = (category) => {
    const colors = {
        tip: 'bg-green-100 text-green-700 border-green-200',
        question: 'bg-blue-100 text-blue-700 border-blue-200',
        success: 'bg-purple-100 text-purple-700 border-purple-200',
        general: 'bg-gray-100 text-gray-700 border-gray-200'
    };
    return colors[category] || colors.general;
};

export const Community = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [loading, setLoading] = useState(true);
    const [showPostForm, setShowPostForm] = useState(false);
    const [expandedComments, setExpandedComments] = useState({});

    useEffect(() => {
        loadPosts();
    }, [selectedCategory]);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const data = await communityService.getPosts(selectedCategory);
            setPosts(data.posts || []);
        } catch (err) {
            console.error('Error loading posts:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async (postData) => {
        try {
            await communityService.createPost({
                ...postData,
                user_id: user?.id || 'anonymous',
                user_name: user?.name || 'Guest User'
            });
            setShowPostForm(false);
            loadPosts();
        } catch (err) {
            console.error('Error creating post:', err);
            alert('Failed to create post');
        }
    };

    const handleToggleLike = async (postId) => {
        if (!user) {
            alert('Please login to like posts');
            return;
        }

        try {
            const response = await communityService.toggleLike(postId, user.id);
            setPosts(posts.map(post =>
                post._id === postId
                    ? { ...post, likes_count: response.likes_count, liked: response.liked }
                    : post
            ));
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    };

    const handleDeletePost = async (postId) => {
        if (!confirm('Delete this post?')) return;

        try {
            await communityService.deletePost(postId, user.id);
            loadPosts();
        } catch (err) {
            console.error('Error deleting post:', err);
            alert(err.response?.data?.error || 'Failed to delete post');
        }
    };

    const toggleComments = (postId) => {
        setExpandedComments(prev => ({
            ...prev,
            [postId]: !prev[postId]
        }));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl p-6 shadow-lg">
                <h1 className="text-3xl font-bold mb-2">Community</h1>
                <p className="text-green-100">Connect, share, and learn from fellow farmers</p>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {CATEGORIES.map(cat => (
                    <button
                        key={cat.id}
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-4 py-2 rounded-full whitespace-nowrap font-medium text-sm transition-all ${selectedCategory === cat.id
                                ? 'bg-green-600 text-white shadow-md'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        <span className="mr-1">{cat.icon}</span>
                        {cat.label}
                    </button>
                ))}
            </div>

            {/* Posts Feed */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : posts.length === 0 ? (
                <div className="card text-center py-12">
                    <span className="text-6xl mb-4 block">📭</span>
                    <h3 className="text-xl font-bold text-gray-700 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share something!</p>
                </div>
            ) : (
                posts.map(post => (
                    <PostCard
                        key={post._id}
                        post={post}
                        currentUser={user}
                        onLike={handleToggleLike}
                        onDelete={handleDeletePost}
                        onToggleComments={toggleComments}
                        commentsExpanded={expandedComments[post._id]}
                    />
                ))
            )}

            {/* Floating Create Button */}
            {user && (
                <button
                    onClick={() => setShowPostForm(true)}
                    className="fixed bottom-24 right-6 w-14 h-14 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 flex items-center justify-center transition-transform hover:scale-110 z-10"
                >
                    <Plus className="w-6 h-6" />
                </button>
            )}

            {/* Post Creation Modal */}
            {showPostForm && (
                <PostFormModal
                    onClose={() => setShowPostForm(false)}
                    onSubmit={handleCreatePost}
                />
            )}
        </div>
    );
};

// Post Card Component
const PostCard = ({ post, currentUser, onLike, onDelete, onToggleComments, commentsExpanded }) => {
    const isOwner = currentUser?.id === post.user_id;
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const loadComments = async () => {
        try {
            setLoadingComments(true);
            const data = await communityService.getComments(post._id);
            setComments(data.comments || []);
        } catch (err) {
            console.error('Error loading comments:', err);
        } finally {
            setLoadingComments(false);
        }
    };

    useEffect(() => {
        if (commentsExpanded) {
            loadComments();
        }
    }, [commentsExpanded]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            await communityService.createComment(post._id, {
                user_id: currentUser.id,
                user_name: currentUser.name,
                content: newComment
            });
            setNewComment('');
            loadComments();
        } catch (err) {
            console.error('Error adding comment:', err);
            alert('Failed to add comment');
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Delete this comment?')) return;

        try {
            await communityService.deleteComment(commentId, currentUser.id);
            loadComments();
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    return (
        <div className="card space-y-4 animate-fade-in">
            {/* User Header */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center font-bold text-green-700">
                        {post.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800">{post.user_name}</h3>
                        <p className="text-sm text-gray-500">
                            {new Date(post.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(post.category)}`}>
                        {CATEGORIES.find(c => c.id === post.category)?.icon} {post.category}
                    </span>
                    {isOwner && (
                        <button
                            onClick={() => onDelete(post._id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Post Content */}
            <div className="text-gray-700 whitespace-pre-wrap">{post.content}</div>

            {/* Post Actions */}
            <div className="flex gap-4 pt-2 border-t">
                <button
                    onClick={() => onLike(post._id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                    <Heart className={`w-5 h-5 ${post.liked ? 'fill-red-500 text-red-500' : ''}`} />
                    <span className="text-sm font-medium">{post.likes_count || 0}</span>
                </button>

                <button
                    onClick={() => onToggleComments(post._id)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm font-medium">{post.comment_count || 0}</span>
                </button>
            </div>

            {/* Comments Section */}
            {commentsExpanded && (
                <div className="space-y-3 pt-4 border-t">
                    {loadingComments ? (
                        <div className="text-center py-4 text-gray-500">Loading comments...</div>
                    ) : comments.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">No comments yet</div>
                    ) : (
                        comments.map(comment => (
                            <div key={comment._id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">
                                    {comment.user_name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <span className="font-semibold text-sm text-gray-800">{comment.user_name}</span>
                                            <span className="text-xs text-gray-500 ml-2">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {currentUser?.id === comment.user_id && (
                                            <button
                                                onClick={() => handleDeleteComment(comment._id)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                </div>
                            </div>
                        ))
                    )}

                    {/* Add Comment Form */}
                    {currentUser && (
                        <form onSubmit={handleAddComment} className="flex gap-2">
                            <input
                                type="text"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            />
                            <button
                                type="submit"
                                disabled={!newComment.trim()}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

// Post Form Modal Component
const PostFormModal = ({ onClose, onSubmit }) => {
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('general');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!content.trim()) return;

        setSubmitting(true);
        try {
            await onSubmit({ content, category });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-800">Create Post</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What would you like to share?
                        </label>
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Share your farming tips, ask questions, or celebrate your success..."
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!content.trim() || submitting}
                            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {submitting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
