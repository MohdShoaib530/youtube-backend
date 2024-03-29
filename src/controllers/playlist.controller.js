import { Playlist } from '../models/playlist.model.js';
import apiError from '../utils/ApiError.js';
import apiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

const createPlaylist = asyncHandler(async (req, res, next) => {
    console.log('videos array url',req.body.videos);

    const { name, description, videos } = req.body;
    const userId = req.user?._id;

    if(!name || !videos || !description){
        throw next(new apiError(400,'all fields are required to create a playlist'));
    }

    const playList = await Playlist.create({
        name,
        description,
        videos,
        owner: userId
    });

    if(!playList){
        throw next(new apiError(500,'something went wrong while creating playlist'));
    }

    res
        .status(200)
        .json(new apiResponse(200,playList,'playlist created successfully'));

});
const getPlaylistById = asyncHandler(async (req, res, next) => {
    const { playlistId } = req.params;

    if(!playlistId){
        throw next(new apiError(400,'playlistId must be provided'));
    }

    const playlist = await Playlist.findById(playlistId).populate('videos');

    if(!playlist){
        throw next(new apiError(500,'No playlist found in the database'));
    }

    res
        .status(200)
        .json(new apiResponse(200,playlist,'playlist fetched successfully'));


});
const updatePlaylist = asyncHandler(async (req, res, next) => {
    const { playlistId } = req.params;
    const { name, videos, description} = req.body;

    if(!playlistId){
        throw next(new apiError(400,'playList Id is required to get the playlist'));
    }

    const playlist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            name,
            videos,
            description
        },
        {
            new: true
        }
    );

    if(!playlist){
        throw next( new apiError(500,'no such playlist is availble in the db'));
    }

    res
        .status(200)
        .json(new apiResponse(200,playlist,'playlist fetched sucessfully'));
});
const deletePlaylist = asyncHandler(async (req, res, next) => {
    const { playlistId } = req.params;

    if(!playlistId){
        throw next(new apiError(400,'playListId is required ot delete the playlist'));
    }

    const playlistDelete = await Playlist.findByIdAndDelete(playlistId);

    if(!playlistDelete){
        throw next(new apiError(500,'unable to delete the playlist now'));
    }

    res
        .status(200)
        .json(new apiResponse(200,playlistDelete,'playlist has been deleted'));


});
const addVideoToPlaylist = asyncHandler(async (req, res, next) => {
    const { videoId ,playlistId } = req.params;
    console.log(videoId,playlistId);

    if(!playlistId || !playlistId){
        throw next(new apiError(400,'playListId is required ot delete the playlist'));
    }

    const addVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $push: { videos: { $each: [videoId] } }
        },
        {
            new: true
        }
    );
    console.log('delete',addVideo);

    if(!addVideo){
        throw next(new apiError(500,'something went wrong while updating video'));
    }

    res
        .status(200)
        .json(new apiResponse(200,addVideo,'playlist has been updated'));
});
const removeVideoFromPlaylist = asyncHandler(async (req, res, next) => {
    const { videoId ,playlistId } = req.params;

    if(!playlistId || !playlistId){
        throw next(new apiError(400,'playListId is required ot delete the playlist'));
    }

    const removeVideo = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $pull: { videos: videoId }
        },
        {
            new: true
        }
    );
    console.log('delete',removeVideo);

    if(!removeVideo){
        throw next(new apiError(500,'something went wrong while updating video'));
    }

    res
        .status(200)
        .json(new apiResponse(200,removeVideo,'playlist has been updated'));
});
const getUserPlaylists = asyncHandler(async (req, res, next) => {

    const userPlaylist = await Playlist.find({owner: req.user?._id}).populate('videos');

    console.log('use',userPlaylist);

    if(!userPlaylist){
        throw next(new apiError(500,'something went wrong whle getting playlist'));
    }

    res
        .status(200)
        .json(new apiResponse(200,userPlaylist,'user playlist has been fetched successfully'));
});

export {
    createPlaylist,
    getPlaylistById,
    updatePlaylist,
    deletePlaylist,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    getUserPlaylists
};