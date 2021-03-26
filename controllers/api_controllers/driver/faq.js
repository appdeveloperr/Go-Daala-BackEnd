const db = require("../../../models/api_models");
const config = require("../../../config/auth.config");
const Faqs = db.faqs;
exports.get_all_faqs = (req, res) => {
    Faqs.findAll().then(all_faqs => {
        if (!all_faqs) {
            return res.status(200).send({
                responsecode: 400,
                message: "no recode is exist",
                successData: {
                }
            });
        } else {
            return res.status(200).send({
                status: 200,
                message: "list of all FAQ's' ",
                successData: {
                    all_faqs_list: {
                        all_faqs: all_faqs

                    }
                }
            });
        }



    }).catch(err => {
        return res.status(200).send({
            responsecode: 400,
            message: err.message,
            successData: {

            }
        });
    });
}
