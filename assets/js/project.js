//now what?
//api:  http://www.ist.rit.edu/api/

$(document).ready(function(){

    loadDegrees();


});


/**
 * Build a object which simplifies building an html element
 * @returns html text
 */
function buildNode() {
    var node = {
        content: "",
        // add a custom element with tag
        add: function (input, tag, attributes) {
            if(input !== undefined && tag !== undefined) {
                if (attributes === undefined) {
                    this.content += "<" + tag + ">" + input + "</" + tag + ">";
                }
                // allow for attributes to be added to an element
                else {
                    this.content += "<" + tag + " " + attributes + ">" + input + "</" + tag + ">";
                }
            }
        },
        // adds a paragraph element
        addPar: function (line) {
            if(input !== undefined) {
                this.content += "<p>" + line + "</p>";
            }
        },
        // add raw string
        addRaw: function (line) {
            if(line !== undefined) {
                this.content += line;
            }
        },
        // return the content
        getHtml: function () {
            return this.content;
        }

    };
    return node;
};


function loadUndergrad() {
    myXhr('get',{path:'/degrees/undergraduate/'},'#content').done(function(json){
        //got good data back in json
        //dump out all of the degree titles
        $.each(json.undergraduate,function(i, item){
            console.log($(this));
            //console.log(item.degreeName);
            var node = buildNode();
            node.add(item.title,"h2");
            node.addPar(item.description);
            $('#content').html(node.getHtml());
        });
    });
}

function loadAbout() {
    myXhr('get',{path:'/about/'},'#about').done(function(json){

        var node = buildNode();
        node.add(json.title,"h2");
        node.addPar(json.description);
        node.addPar(json.quote);
        node.addPar(json.quoteAuthor);

        $('#about').html(node.getHtml());

    });
}

function loadPeople() {
    myXhr('get',{path:'/people/'},'#people').done(function(json){
        // do something...
        var node = buildNode();
        $.each(json.faculty,function(i, item){
            //item === this
            console.log(i);
            console.log(item);
            console.log($(this));

            node.addRaw( '<div onclick="getFac(this)" data-username="'+item.username+'">' );
            node.addRaw( '<h2>'+item.name+'</h2><p>'+item.tagline+'</p>' );
            node.addRaw( '<img src="'+item.imagePath+'"/></div>' );
        });
        $('#people').html(node.getHtml());
    });
}


function loadDegrees() {
    console.log("we are here");
    myXhr('get',{path:'/degrees/'},'#degrees').done(function (json) {
        var all_content = buildNode();

        var undergrad = buildNode();
        $.each(json.undergraduate,function(index,item) {
            var concentrations = item.concentrations;
            undergrad.add(item.title);
            undergrad.add(item.degreeName,'p');
            undergrad.add(item.description,'p');

        });

        var graduate = buildNode();
        $.each(json.graduate, function (index, item) {
            graduate.add(item.title,'p');
            graduate.add(item.degreeName,'p');
            graduate.add(item.description,'p');
        });

        all_content.addRaw( undergrad.getHtml() + graduate.getHtml());
        $('#degrees').html(all_content.getHtml());
    });
}




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

