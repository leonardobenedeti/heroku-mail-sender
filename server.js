var express = require("express");
var bodyParser = require("body-parser");
const sgMail = require('@sendgrid/mail');
require("dotenv").config();

var app = express();

app.use(bodyParser.raw());
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

var server = app.listen(process.env.PORT || 8080, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
});

function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
}

app.post("/sendmail/template", function(req, res){
    const {to, from, template_data} = req.body;
    const msg = {
        to: to,
        from: from,
        templateId: 'd-ee4c43022cc74cec802e5398cb54a31f',
        dynamic_template_data: template_data,
    };
    sgMail.send(msg)
    .then((success)=>{
      res.status(200).send({success: "Email enviado com sucesso"});
    }).catch(err=>res.status(400).send({error:"Algo de errado não está certo no envio de emails."})); 
});

app.post("/sendmail", function(req, res){

    const {to, from, template_data} = req.body;

    const message = `
        <p>
            Olá ${template_data.user}, <br/>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            Aliquam tincidunt elementum sem non luctus. 
            Ut dolor nisl, facilisis non magna quis, elementum ultricies tortor. 
            In mattis, purus ut tincidunt egestas, ligula nulla accumsan justo, vitae bibendum orci ligula id ipsum. 
            Nunc elementum tincidunt libero, in ullamcorper magna volutpat a.
        </p>
    `;

    const msg = {
        to: to,
        from: from,
        subject: 'Example Transactional email without template',
        html: message,
    };
    sgMail.send(msg)
    .then((success)=>{
      res.status(200).send({success: "Email enviado com sucesso"});
    }).catch(err=>res.status(400).send({error:"Algo de errado não está certo no envio de emails."}));
    
});
