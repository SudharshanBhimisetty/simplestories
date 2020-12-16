const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

const Story = require('../models/Story')

// rendering all public stories of all users
router.get('/', ensureAuth, async (req,res) => {
    try{
        const stories = await Story.find({ status: 'public' })
             .populate('user')
             .sort({ createdAt: 'desc' })
             .lean()

    
        res.render('stories/index',{ stories, })

    }catch(err){
        console.log(err);
        res.render('error/500')
    }
})

// posting a story from add button and redirecting to present users dashboard
router.post('/', ensureAuth, async (req,res) => {
    try{
        req.body.user = req.user.id
        await Story.create(req.body)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/500')
    }
})




// rendering the add page for story
router.get('/add', ensureAuth, (req,res) => {
    res.render("stories/add")
})



// rendering the show page of each story from index.hbs
router.get('/:id',ensureAuth, async (req,res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        res.render('stories/show',{story})

    } catch (error) {
          console.log(err);
        res.render('error/404')     
    }
})


// getting the edit page of individual story
router.get('/edit/:id',ensureAuth, async (req,res) => {
    const story = await Story.findOne({
        _id:req.params.id
    }).lean()

    if(!story){
        return res.render('error/404')
    }

    if(story.user != req.user.id){
        res.redirect('/stories')
    }else{
        res.render('stories/edit',{ story })
    }
})


// response gets from the edit page and we update in the database
router.put('/:id',ensureAuth, async (req,res) => {

        try {
            let story = await Story.findById(req.params.id).lean()

            if(!story){
                return res.render('error/404')
            }
        
        
            if(story.user != req.user.id){
                res.redirect('/stories')
            }else{
                story = await Story.findOneAndUpdate({_id: req.params.id}, req.body)
        
                res.redirect('/dashboard')
            }
                   
        } catch (err) {
            console.error(err)
            return res.render('error/500')
        }
})


// for deleting
router.delete('/:id',ensureAuth, async (req,res) => {
    try{
        await Story.remove({_id: req.params.id })
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        return res.render('error/500')
    }
})


// getting all stories from only one individual user
router.get('/user/:userId',ensureAuth, async(req,res) => {
    try {
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('stories/index',{
            stories
        })

    } catch (err) {
                console.error(err)
        return res.render('error/500')
    }
})

module.exports = router