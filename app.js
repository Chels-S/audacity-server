require("dotenv").config();
const Express = require('express');
const app = Express();
app.use(Express.json());
const controllers = require ('./controllers');
const dbConnection = require('./db');
const middleware = require('./middleware');

app.use(middleware.headers);

// app.use('/test', (req, res)=> {
//     res.send('Test message')
// });


app.use('/user', controllers.usercontroller);
app.use('/raids', controllers.raidcontroller);
app.use('/trials', controllers.trialcontroller);

dbConnection.authenticate()
.then(() => dbConnection.sync())
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`[Server]: App is listening on ${process.env.PORT}`)
    });
})
.catch((error) => {
    console.log(`[Server]: Server has crashed. Error = ${error}`);
});
