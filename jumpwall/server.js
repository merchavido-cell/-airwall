const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());
app.use(express.static("public"));

const jsonFile = path.join(__dirname, "listofwin.json");

app.get("/namelist", (req, res) => {
    fs.readFile(jsonFile, "utf8", (err, data) => {
        if (err) return res.status(500).send(err);
        res.json(JSON.parse(data));
    });
});

app.post("/addwin", (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(400).send({ error: "No name provided" });

    fs.readFile(jsonFile, "utf8", (err, data) => {
        if (err) return res.status(500).send(err);
        const json = JSON.parse(data);
        json.namelist.push(name);

        fs.writeFile(jsonFile, JSON.stringify(json, null, 2), (err) => {
            if (err) return res.status(500).send(err);
            res.json(json); 
        });
    });
});

const PORT = process.env.PORT || 3000;
fs.readFile(jsonFile, "utf8", (err, data) => {
    if (err) {
        console.error("Error reading listofwin.json:", err);
        return;
    }
    const jsonData = JSON.parse(data);
    
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
        console.log("The current list of names is:", jsonData.namelist);
    });
});
