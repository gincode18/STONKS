const express = require("express");
const teamController = require("./../controllers/teamController");
const authController = require("./../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router
    .route('/')
    .get(teamController.getTeam)
    .post(teamController.createTeam)
    .patch(teamController.updateTeamName)
    .delete(teamController.deleteTeam);

router
    .route('/join')
    .post(teamController.joinTeam);

router
    .route('/leave')
    .delete(teamController.leaveTeam);

router
    .route('/removeMember/:id')
    .patch(teamController.removeMember);

module.exports = router;
