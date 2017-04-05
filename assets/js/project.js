//now what?
//api:  http://www.ist.rit.edu/api/


    $(document).ready(function(){
        loadEmployment();




    });


    function loadAbout() {
        myXhr('get',{path:'/about/'},'#about').done(function(json){

            var node = buildNode();
            node.add(json.title,'h2');
            node.add(json.description,'p');
            node.add(json.quote,'p');
            node.add(json.quoteAuthor,'p');

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


    function loadMinors() {
        myXhr('get',{path:'/minors/'},"#minors").done(function (json) {
            var minors = buildNode();
            $.each(json.UgMinors,function (index, value) {
                var courses = value.courses;
                minors.add(value.name,'p');
                minors.add(value.title,'p');
                minors.add(value.description,'p');
                minors.add(value.note,'p');
                minors.add(courses.toString(),'p');
            });

            $('#minors').html(minors.getHtml());
        });
    }

    function loadEmployment() {
        myXhr('get',{path:'/employment/'},"#employment").done(function (json) {
            var employement = buildNode();

            console.log(json);

            // get all fields
            var introduction = json.introduction;
            var careers      = json.careers;
            var degreeStats  = json.degreeStatistics;
            var coopTable    = json.coopTable;
            var employers    = json.employers;
            var employTable  = json.employmentTable;


            // build introduction node;
            var intro_div = buildNode();
            intro_div.add(introduction.title,'h2');
            $.each(introduction.content,function (index,value) {
                intro_div.add(value.title,'h2');
                intro_div.add(value.description,'p');
            });

            // build careers div
            var careers_div = buildNode();
            careers_div.add(careers.title,'h2');
            $.each(careers.careerNames,function (index, value) {
                careers_div.add(value,'p');
            });

            // build degreeStats div
            var stats_div = buildNode();
            var list_name = 'stats';
            stats_div.createList(list_name);
            stats_div.add(degreeStats.title,'h2');
            $.each(degreeStats.statistics,function (index, value) {
                stats_div.addToList(list_name,
                    stats_div.formatInput(value.description,'p') +
                    stats_div.formatInput(value.value,'p'),
                    'li');
            });
            stats_div.add(stats_div.listToHtml(list_name,'ul'),'div');

            // build employers div
            var employers_div = buildNode();




            // wrap and add child nodes
            employement.add(intro_div.getHtml(),'div');
            employement.add(careers_div.getHtml(),'div');
            employement.add(stats_div.getHtml(),'div');

            $('#employment').html(employement.getHtml());
        });
    }



//employment



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





