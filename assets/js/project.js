//now what?
//api:  http://www.ist.rit.edu/api/
$(document).ready(function(){
    myXhr('get',{path:'/about/'},'#about').done(function(json){
        var x="<h2>"+json.title+"</h2>";
        x+="<p>"+json.description+"</p>";
        x+="<p>"+json.quote+"</p>";
        x+="<p>"+json.quoteAuthor+"</p>";
        $('#about').html(x);
    });

    myXhr('get',{path:'/degrees/undergraduate/'},'#content').done(function(json){
        //got good data back in json
        //dump out all of the degree titles
        $.each(json.undergraduate,function(i, item){
            console.log($(this));
            //console.log(item.degreeName);
            $('#content').append('<h2>'+item.title+'</h2>'+'<p>'+item.description+'</p>');
        });
    });
    myXhr('get',{path:'/people/'},'#people').done(function(json){
        // do something...
        var x='';
        $.each(json.faculty,function(i, item){
            //item === this
            console.log(i);
            console.log(item);
            console.log($(this));
            x+='<div onclick="getFac(this)" data-username="'+item.username+'">';
            x+='<h2>'+item.name+'</h2><p>'+item.tagline+'</p>';
            x+='<img src="'+item.imagePath+'"/></div>';
        });
        $('#people').html(x);
    });

});


function getFac(dom){
    myXhr('get',{path:'/people/faculty/username='+$(dom).attr('data-username')},null).done(function(json){
        console.log(json);
    });
}
///////////////////////////////////////////////////
//utilities...
//data - {path:'/about/'}
//(getOrPost, data, idForSpinner)
function myXhr(t, d, id){
    return $.ajax({
        type:t,
        url:'proxy.php',
        dataType:'json',
        data:d,
        cache:false,
        async:true,
        beforeSend:function(){
            //PLEASE - get your own spinner that 'fits' your site.
            $(id).append('<img src="gears.gif" class="spin"/>');
        }
    }).always(function(){
        //kill spinner
        $(id).find('.spin').fadeOut(5000,function(){
            $(this).remove();
        });
    }).fail(function(){
        //handle failure
    });
}

