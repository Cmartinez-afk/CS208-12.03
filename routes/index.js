var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  try {
    req.db.query('SELECT * FROM todos;', (err, results) => {
      if (err) {
        console.error('Error fetching todos:', err);
        return res.status(500).send('Error fetching todos');
      }
      res.render('index', { title: 'My Simple TODO', todos: results });
    });
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).send('Error fetching items');
  }
});

/**Create a new task */
router.post('/create', function (req, res, next) {
  const { task } = req.body;
  try {
    req.db.query('INSERT INTO todos (task) VALUES (?);', [task], (err, results) => {
      if (err) {
        console.error('Error adding todo:', err);
        return res.status(500).send('Error adding todo');
      }
      console.log('Todo added successfully:', results);
      // Redirect to the home page after adding
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).send('Error adding todo');
  }
});

/* GET edit page */
router.get('/edit', function(req, res, next) {
  const { id } = req.query;

  try {
    req.db.query(
      'SELECT * FROM todos WHERE id = ?;',
      [id],
      (err, results) => {
        if (err) {
          console.error('Error fetching todo:', err);
          return res.status(500).send('Error fetching todo');
        }

        if (results.length === 0) {
          return res.status(404).send('Task not found');
        }

        res.render('edit', {
          title: 'Edit Task',
          todo: results[0]
        });
      }
    );
  } catch (error) {
    console.error('Error editing todo:', error);
    res.status(500).send('Error editing todo');
  }
});

/* UPDATE an existing task */
router.post('/update', function(req, res, next) {
  const { id, task } = req.body;

  if (!task || !task.trim()) {
    return res.status(400).send('Task cannot be empty');
  }

  try {
    req.db.query(
      'UPDATE todos SET task = ? WHERE id = ?;',
      [task.trim(), id],
      (err, results) => {
        if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).send('Error updating todo');
        }

        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send('Error updating todo');
  }
});

/* MARK task as completed */
router.post('/complete', function(req, res, next) {
  const { id } = req.body;

  try {
    req.db.query(
      'UPDATE todos SET completed = 1 WHERE id = ?;',
      [id],
      (err, results) => {
        if (err) {
          console.error('Error completing todo:', err);
          return res.status(500).send('Error completing todo');
        }

        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error completing todo:', error);
    res.status(500).send('Error completing todo');
  }
});

/* MARK task as incomplete */
router.post('/incomplete', function(req, res, next) {
  const { id } = req.body;

  try {
    req.db.query(
      'UPDATE todos SET completed = 0 WHERE id = ?;',
      [id],
      (err, results) => {
        if (err) {
          console.error('Error updating todo:', err);
          return res.status(500).send('Error updating todo');
        }

        res.redirect('/');
      }
    );
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send('Error updating todo');
  }
});

router.post('/delete', function (req, res, next) {
  const { id } = req.body;
  try {
    req.db.query('DELETE FROM todos WHERE id = ?;', [id], (err, results) => {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).send('Error deleting todo');
      }
      console.log('Todo deleted successfully:', results);
      // Redirect to the home page after deletion
      res.redirect('/');
    });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Error deleting todo:');
  }
});

module.exports = router;