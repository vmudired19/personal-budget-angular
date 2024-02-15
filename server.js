const express = require('express');
const cors = require('cors');
const fileSystem = require('fs');
const app = express();
const port = 3000;
const importJSON = fileSystem.readFileSync('budget.json', 'utf8');
const budgetData = JSON.parse(importJSON);

app.use(cors());


app.get('/budget', (req, res) => {
    res.json(budgetData);
});

app.listen(port, () =>
{
console.log(`API app listening at http://localhost:${port}`);
}
);
