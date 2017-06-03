class Home {
    get (req, res){
        res.json({ ok: true, message: 'This is the API behind the Drawing App.' });
    }
}

module.exports = Home;