const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const Team = require('./../models/teamModel');

exports.createTeam = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    if (!name) return next(new AppError('Enter the team name!!', 400));
    const isTeamMember = await Team.findOne({ members: req.user.id });
    console.log(isTeamMember);
    if (isTeamMember) return next(new AppError('You are already in team, Leave that team for joining other team', 400));

    const team = (await Team.create({ name: name, lead: req.user.id, members: [req.user.id] }));

    res.status(200).json({
        status: 'success',
        team
    });
});

exports.updateTeamName = catchAsync(async (req, res, next) => {
    const { name } = req.body;
    if (!name) return next(new AppError('Enter the Team name!', 400));

    const team = await Team.findOne({ lead: req.user.id });
    if (!team) return next(new AppError('only teamLead can change the name', 400));
    team.name = name;
    await team.save();
    res.status(200).json({
        status: 'success',
        team
    });
});

exports.joinTeam = catchAsync(async (req, res, next) => {
    const { teamCode } = req.body;

    const team = await Team.findOne({ teamCode: teamCode });
    if (!team) return next(new AppError('No team found!', 400));

    if (team.members.includes(req.user.id)) return next(new AppError('You are already in Team', 400));
    if (team.members.length >= 4) return next(new AppError('Team is full', 400));
    team.members.push(req.user.id);
    await team.save();

    res.status(200).json({
        status: 'success'
    });
});

exports.leaveTeam = catchAsync(async (req, res, next) => {
    const team = await Team.findOne({ members: req.user.id });
    if (!team) return next(new AppError('No team found!', 400));
    let index = team.members.indexOf(req.user.id);
    if (index !== -1) {
        team.members.splice(index, 1);
    }
    await team.save();
    res.status(200).json({
        status: 'Success'
    });
});

exports.deleteTeam = catchAsync(async (req, res, next) => {
    const team = await Team.findOne({ lead: req.user.id });
    if (!team) return next(new AppError('Only team leads can delete the team', 401));
    await Team.deleteOne({ lead: req.user.id });
    res.status(204).json({
        status: "success"
    });
});

exports.getTeam = catchAsync(async (req, res, next) => {
    const team = await Team.findOne({ members: req.user.id }).populate({ path: 'members', select: 'name regNo email' });;
    if (!team) return next(new AppError('No team found', 400));
    res.status(200).json({
        status: 'success',
        team
    });
});

exports.removeMember = catchAsync(async (req, res, next) => {
    const team = await Team.findOne({ lead: req.user.id });
    if (!team) return next(new AppError('Only team lead can remove the members', 400));
    if (!req.params.id) return next(new AppError('No id is given!!', 400));

    team.members.splice((team.members.indexOf(req.params.id)), 1);
    team.save();

    res.status(200).json({
        status: 'success',
        team
    });
});