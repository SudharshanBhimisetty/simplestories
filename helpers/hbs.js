const moment = require('moment')


module.exports = {
    formatDate: function(date,format){
        return moment(date).format(format)
    },
    truncate: function (str,len){
        if(str.length > len && str.length > 0){
            console.log("first line:")
            let new_str = str + ' '
            console.log(new_str)
            console.log("second line:")
            new_str = str.substr(0,len)
            console.log(new_str)
            console.log("third line:")
            new_str = str.substr(0, new_str.lastIndexOf(' '))
            console.log(new_str)
            console.log("fourth line:")
            new_str = new_str.length > 0 ? new_str : str.substr(0,len)
            console.log(new_str)
            return new_str + '...'
        }
        return str
    },
    stripTags: function(input){
        return input.replace(/<(?:.|\n)*?>/gm, '')
    },
    editIcon: function(storyUser, loggedUser, storyId, floating = true){
        if(storyUser._id.toString() == loggedUser._id.toString()){
            if(floating){
                return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`
            }
            else{
                return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit fa-small"></i></a>`
            }
        }else{
            return " "
        }
    },
    select: function(selected, options){
        return options
           .fn(this)
           .replace(
             new RegExp(' value="' + selected + '"'),
             '$& selected="selected"'
           )
           .replace(
            new RegExp('>' + selected + '</option>'),
            ' selected="selected"$&'              
           )
    },

}