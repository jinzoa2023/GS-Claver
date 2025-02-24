from flask import Flask, request, jsonify, render_template, send_from_directory
import sqlite3
import os

app = Flask(__name__, 
    template_folder='../templates',  # Point to templates directory
    static_folder='../static'        # Point to static directory
)

# Database initialization
def init_db():
    db_path = 'database/church.db'
    os.makedirs('database', exist_ok=True)
    
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    
    # Create songs table
    c.execute('''
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database when app starts
init_db()

# Routes
@app.route('/')
def index():
    print("Static folder path:", app.static_folder)  # Debug print
    print("Template folder path:", app.template_folder)  # Debug print
    return render_template('index.html')

@app.route('/add-song', methods=['POST'])
def add_song():
    try:
        title = request.json['title']
        
        conn = sqlite3.connect('database/church.db')
        c = conn.cursor()
        c.execute('INSERT INTO songs (title) VALUES (?)', (title,))
        conn.commit()
        conn.close()
        
        return jsonify({'status': 'success', 'message': 'Song added successfully'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

@app.route('/get-songs', methods=['GET'])
def get_songs():
    try:
        conn = sqlite3.connect('database/church.db')
        c = conn.cursor()
        c.execute('SELECT title FROM songs ORDER BY created_at DESC')
        songs = [row[0] for row in c.fetchall()]
        conn.close()
        
        return jsonify({'status': 'success', 'songs': songs})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)})

# Add a direct route to serve static files (for debugging)
@app.route('/static/<path:filename>')
def custom_static(filename):
    print(f"Attempting to serve static file: {filename}")  # Debug print
    return send_from_directory(app.static_folder, filename)

if __name__ == '__main__':
    app.run(debug=True) 