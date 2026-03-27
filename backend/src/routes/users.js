const express = require('express');
const router = express.Router();
const { getUsers, updateUser, deleteUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/').get(getUsers);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;
