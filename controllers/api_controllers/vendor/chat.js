const db = require("../../../models/api_models");
const Chat = db.chat;



//--------------vendor get all chats------------
exports.get_chat = (req, res) => {
    req.checkBody('trip_id', 'Trip id must have required!').notEmpty();
    var errors = req.validationErrors();
    if (errors) {                    //////////------input text validation error
        return res.status(200).send({
            status: 400,
            message: "validation Get vendor chat",
            successData: {
                error: {
                    error: errors
                }
            }
        });
    } else {
    Chat.findAll({
        where:{
            trip_id:req.body.trip_id
        },
        order: [
            ['id', 'ASC'],
        ]
	}).then(all_chats => {
        if (!all_chats) {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode exist",
                successData: {

                }
            });
        }
        return res.status(200).send({
            status: 200,
            message: "Get all vendor chats",
            successData: {
                all_chats: all_chats
            }
        });



    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
        });
    });
	}
}