const express = require("express");
const bodyparser = require("body-parser");
const fs = require("fs");
const csv = require("csv-parser");

const XcsvPath = __dirname+"//X.csv";
const YcsvPath = __dirname+"//Y.csv";

const  app = express();
app.use(bodyparser.json());

app.listen(process.env.PORT || "3000",()=>{console.log("PORT::3000 Engaged");})

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"//index.html");
})

app.get("/getData", (req,res)=>{
    const {i} = req.query;
    let start = 10*i;
    let currentIndex=0;
    let dataArray = [];
    let xData = [];
    let yData = [];
    fs.createReadStream(XcsvPath)
    .pipe(csv({headers: false}))
    .on('data', (row)=>{
        if(currentIndex>=start && currentIndex<start+10){
            xData.push(parseFloat(row[0]));
        }
        currentIndex++;
    })
    .on('end',()=>{
        currentIndex=0;
        fs.createReadStream(YcsvPath)
        .pipe(csv({headers: false}))
        .on('data', (row)=>{
            if(currentIndex>=start && currentIndex<start+10)
            {
                yData.push(parseFloat(row[0]))
            }
            currentIndex++;
        })
        .on('end', ()=>{
            dataArray.push(xData);
            dataArray.push(yData);
            res.send(dataArray);
        })
    })
})