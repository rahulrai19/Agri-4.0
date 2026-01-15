from flask import Blueprint, request, jsonify
from bson import ObjectId
from datetime import datetime
from backend.database import get_db

community_bp = Blueprint('community', __name__, url_prefix='/api/community')

# Helper to serialize MongoDB documents
def serialize_post(post):
    """Convert MongoDB post document to JSON-serializable dict"""
    post['_id'] = str(post['_id'])
    post['likes_count'] = len(post.get('likes', []))
    return post

def serialize_comment(comment):
    """Convert MongoDB comment document to JSON-serializable dict"""
    comment['_id'] = str(comment['_id'])
    return comment

# ============================================
# POSTS ENDPOINTS
# ============================================

@community_bp.route('/posts', methods=['GET'])
def get_posts():
    """Get all posts with optional category filter"""
    try:
        db = get_db()
        category = request.args.get('category')
        limit = int(request.args.get('limit', 20))
        skip = int(request.args.get('skip', 0))
        
        # Build query
        query = {}
        if category and category != 'all':
            query['category'] = category
        
        # Get posts sorted by newest first
        posts = list(db.posts.find(query)
                    .sort('created_at', -1)
                    .limit(limit)
                    .skip(skip))
        
        # Serialize posts
        posts = [serialize_post(post) for post in posts]
        
        return jsonify({
            'posts': posts,
            'total': db.posts.count_documents(query)
        }), 200
        
    except Exception as e:
        print(f"Error fetching posts: {e}")
        return jsonify({"error": str(e)}), 500

@community_bp.route('/posts', methods=['POST'])
def create_post():
    """Create a new post"""
    try:
        db = get_db()
        data = request.json
        
        # Validate required fields
        if not data.get('user_id') or not data.get('user_name') or not data.get('content'):
            return jsonify({"error": "Missing required fields: user_id, user_name, content"}), 400
        
        # Create post document
        post = {
            'user_id': data['user_id'],
            'user_name': data['user_name'],
            'content': data['content'],
            'images': data.get('images', []),
            'category': data.get('category', 'general'),
            'likes': [],
            'comment_count': 0,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow()
        }
        
        # Insert into database
        result = db.posts.insert_one(post)
        post['_id'] = str(result.inserted_id)
        post['likes_count'] = 0
        
        return jsonify(serialize_post(post)), 201
        
    except Exception as e:
        print(f"Error creating post: {e}")
        return jsonify({"error": str(e)}), 500

@community_bp.route('/posts/<post_id>', methods=['GET'])
def get_post(post_id):
    """Get a single post by ID"""
    try:
        db = get_db()
        
        # Find post
        post = db.posts.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        return jsonify(serialize_post(post)), 200
        
    except Exception as e:
        print(f"Error fetching post: {e}")
        return jsonify({"error": str(e)}), 500

@community_bp.route('/posts/<post_id>', methods=['DELETE'])
def delete_post(post_id):
    """Delete a post (owner only)"""
    try:
        db = get_db()
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id required"}), 400
        
        # Find post and verify ownership
        post = db.posts.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        if post['user_id'] != user_id:
            return jsonify({"error": "Unauthorized: Can only delete your own posts"}), 403
        
        # Delete post
        db.posts.delete_one({'_id': ObjectId(post_id)})
        
        # Delete associated comments
        db.comments.delete_many({'post_id': post_id})
        
        return jsonify({"message": "Post deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting post: {e}")
        return jsonify({"error": str(e)}), 500

# ============================================
# LIKES ENDPOINTS
# ============================================

@community_bp.route('/posts/<post_id>/like', methods=['POST'])
def toggle_like(post_id):
    """Toggle like on a post"""
    try:
        db = get_db()
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id required"}), 400
        
        # Find post
        post = db.posts.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        likes = post.get('likes', [])
        
        # Toggle like
        if user_id in likes:
            # Unlike
            db.posts.update_one(
                {'_id': ObjectId(post_id)},
                {'$pull': {'likes': user_id}}
            )
            liked = False
        else:
            # Like
            db.posts.update_one(
                {'_id': ObjectId(post_id)},
                {'$addToSet': {'likes': user_id}}
            )
            liked = True
        
        # Get updated post
        updated_post = db.posts.find_one({'_id': ObjectId(post_id)})
        
        return jsonify({
            'liked': liked,
            'likes_count': len(updated_post.get('likes', []))
        }), 200
        
    except Exception as e:
        print(f"Error toggling like: {e}")
        return jsonify({"error": str(e)}), 500

# ============================================
# COMMENTS ENDPOINTS
# ============================================

@community_bp.route('/posts/<post_id>/comments', methods=['GET'])
def get_comments(post_id):
    """Get all comments for a post"""
    try:
        db = get_db()
        
        # Get comments sorted by oldest first
        comments = list(db.comments.find({'post_id': post_id})
                       .sort('created_at', 1))
        
        # Serialize comments
        comments = [serialize_comment(c) for c in comments]
        
        return jsonify({'comments': comments}), 200
        
    except Exception as e:
        print(f"Error fetching comments: {e}")
        return jsonify({"error": str(e)}), 500

@community_bp.route('/posts/<post_id>/comments', methods=['POST'])
def create_comment(post_id):
    """Add a comment to a post"""
    try:
        db = get_db()
        data = request.json
        
        # Validate required fields
        if not data.get('user_id') or not data.get('user_name') or not data.get('content'):
            return jsonify({"error": "Missing required fields: user_id, user_name, content"}), 400
        
        # Verify post exists
        post = db.posts.find_one({'_id': ObjectId(post_id)})
        if not post:
            return jsonify({"error": "Post not found"}), 404
        
        # Create comment document
        comment = {
            'post_id': post_id,
            'user_id': data['user_id'],
            'user_name': data['user_name'],
            'content': data['content'],
            'created_at': datetime.utcnow()
        }
        
        # Insert comment
        result = db.comments.insert_one(comment)
        comment['_id'] = str(result.inserted_id)
        
        # Update comment count on post
        db.posts.update_one(
            {'_id': ObjectId(post_id)},
            {'$inc': {'comment_count': 1}}
        )
        
        return jsonify(serialize_comment(comment)), 201
        
    except Exception as e:
        print(f"Error creating comment: {e}")
        return jsonify({"error": str(e)}), 500

@community_bp.route('/comments/<comment_id>', methods=['DELETE'])
def delete_comment(comment_id):
    """Delete a comment (owner only)"""
    try:
        db = get_db()
        data = request.json
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({"error": "user_id required"}), 400
        
        # Find comment and verify ownership
        comment = db.comments.find_one({'_id': ObjectId(comment_id)})
        if not comment:
            return jsonify({"error": "Comment not found"}), 404
        
        if comment['user_id'] != user_id:
            return jsonify({"error": "Unauthorized: Can only delete your own comments"}), 403
        
        post_id = comment['post_id']
        
        # Delete comment
        db.comments.delete_one({'_id': ObjectId(comment_id)})
        
        # Update comment count on post
        db.posts.update_one(
            {'_id': ObjectId(post_id)},
            {'$inc': {'comment_count': -1}}
        )
        
        return jsonify({"message": "Comment deleted successfully"}), 200
        
    except Exception as e:
        print(f"Error deleting comment: {e}")
        return jsonify({"error": str(e)}), 500
