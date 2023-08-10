const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class GameController{
    static async createRoom(req, res){
        try {
            const {name, description, thumbnail_url, game_url, play_count} = req.body;
            const parsedPlayCount = parseInt(play_count);
            const room = await prisma.game.create({
                data:{
                    name, 
                    description, 
                    thumbnail_url, 
                    game_url, 
                    play_count:parsedPlayCount,
                },
            });

            if(!room) 
            return res.status(401).json({
                message:"cannot be empty"});
                
            res.status(202).json({
                message:"succes create room", 
                data: room
            });
        } catch (error) {
            res.status(500).json({msg: error.message});
        }
    }

    static async getRooms(req, res){
        try {
            const rooms = await prisma.game.findMany();
            if(!rooms) return res.status(401).json({result:"error", message:"not found"})
            res.status(200).json({result:"succes", rooms})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }

    static async getRoomsById(req, res){
        try {
            const {id} = req.params;
            const games = await prisma.game.findUnique({where:{id},})
            if(!games) return res.status(400).json({result:"not found"})
            res.status(200).json({ message:`succes get room by id ${id}`, data:games});
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }

    static async updateScore(req, res){
        try {
            const {id} = req.params;
            const getData = await prisma.game.findUnique({where:{id},})
            const visitedRoom = getData.play_count;
            const data = await prisma.game.update({
                where:{id},
                data:{play_count:visitedRoom}
            })
            res.status(200).json({msg:"succes update rooms!", data: data.play_count})
        } catch (error) {
            console.log(error.message);
        }
    }
}

module.exports = GameController
