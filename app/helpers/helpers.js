    const env = require('dotenv').config();
const edge = require('edge.js');
/**
** trying helpers contents
**/
let public_title = "";
let public_active = []; 
/**
** edge register assets command 
**/
edge.global('asset', function(file) {
    if (process.env.APP_MODE == "development") {
        return "assets/"+file;
    }
    return "/assets/"+file; 
});
/**
** set title
**/
edge.global('title',function(title){
    public_title = title;
    return "";
});
/**
** get title
**/
edge.global('getTitle',function(title){
    var assert  =  public_title;
    public_title =  "";
    if (assert.length > 0) {
        assert  = assert + " | ";
    }
    return assert;
});
/**
** handle style sheet
**/
edge.global('style',function(file){
    var uri  = (file.includes('https') || file.includes('http') ? file :  'assets/css/'+file);
    return '<link rel="stylesheet" type="text/css" href="/'+uri+'"> '
});
/**
**handle javascript modeule
**/
edge.global('script',function(file){
    var uri  = (file.includes('https') || file.includes('http') ? file :  'assets/js/'+file);
    return '<script type="text/javascript" src="/'+uri+'" ></script>'
})