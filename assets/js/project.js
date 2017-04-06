//now what?
//api:  http://www.ist.rit.edu/api/


    $(document).ready(function(){

        loadResearch();
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
            var employment = buildNode();

            // get all fields
            var introduction = json.introduction;
            var careers      = json.careers;
            var degreeStats  = json.degreeStatistics;
            var coopTable    = json.coopTable;
            var employers    = json.employers;
            var employTable  = json.employmentTable;

            /////////////////////////////////////////////////////////////////////////
            // build introduction node;
            var intro_div = buildNode();
            intro_div.add(introduction.title,'h2');

            $.each(introduction.content,function (index,value) {
                intro_div.add(value.title,'h2');
                intro_div.add(value.description,'p');
            });
            /////////////////////////////////////////////////////////////////////////
            // build careers div
            var careers_div = buildNode();
            careers_div.add(careers.title,'h2');

            $.each(careers.careerNames,function (index, value) {
                careers_div.add(value,'p');
            });
            /////////////////////////////////////////////////////////////////////////
            // build degreeStats div
            var stats_div = buildNode();
            stats_div.createList('stats');
            stats_div.add(degreeStats.title,'h2');

            $.each(degreeStats.statistics,function (index, value) {
                stats_div.addToList('stats',
                    stats_div.format(value.description,'p')
                  + stats_div.format(value.value,'p')
                  ,'li');
            });
            stats_div.add(stats_div.listToHtml('stats','ul'),'div');

            /////////////////////////////////////////////////////////////////////////
            // build employers div
            var employers_div = buildNode();
            employers_div.add(employers.title,'h2');
            employers_div.createList('employers');

            $.each(employers.employerNames,function (index, value) {
              employers_div.addToList('employers', value,'li');
            });
            employers_div.add( employers_div.listToHtml('employers','ul'), 'div' );

            /////////////////////////////////////////////////////////////////////////
            // build Co-op Table
            var coop_div = buildNode();
            coop_div.createList('co-ops');
            coop_div.add(coopTable.title,'h2');

            var coop_array  = coopTable.coopInformation;
            var coop_length = coop_array.length;

            for( var i = 0; i < coop_length; i++ ){
                var object = coop_array[i];
                coop_div.addToList('co-ops',
                      coop_div.format(object.city,'p')
                    + coop_div.format(object.degree,'p')
                    + coop_div.format(object.employer,'p')
                    + coop_div.format(object.term,'p')
                    ,'li');
            }
            coop_div.add( coop_div.listToHtml('co-ops','ul'), 'div' );

            /////////////////////////////////////////////////////////////////////////
            // build employment table
            var employ_table = buildNode();
            employ_table.createList('table');
            employ_table.add(employTable.title,'h2');

            var employ_array  = employTable.professionalEmploymentInformation;
            var employ_length = employ_array.length;

            for( var i = 0; i < employ_length; i++ ){
                var object = employ_array[i];
                employ_table.addToList('table',
                      employ_table.format(object.title,'p')
                    + employ_table.format(object.city,'p')
                    + employ_table.format(object.degree,'p')
                    + employ_table.format(object.employer,'p')
                    + employ_table.format(object.startDate,'p')
                    ,'li');
            }
            employ_table.add( employ_table.listToHtml('table','ul'), 'div' );
            /////////////////////////////////////////////////////////////////////////


            // wrap and add child nodes
            employment.add(intro_div.getHtml(),'div');
            employment.add(careers_div.getHtml(),'div');
            employment.add(stats_div.getHtml(),'div');
            employment.add(employers_div.getHtml(),'div');
            // employment.add(coop_div.getHtml(),'div');
            // employment.add(employ_table.getHtml(),'div');

            $('#employment').html(employment.getHtml());
        });
    }

    function loadResearch() {
        myXhr('get',{path:'/research/'},"#research").done(function (json) {

            var byFaculty = json.byFaculty;
            var c_faculty = 'citations';

            var byIntrest = json.byInterestArea;
            var c_intrest = 'intrest_citations';

            var research_div = buildNode();

            // add up the byFacutly section
            $.each(byFaculty,function (index, value) {

                // add faculty's name and username
                research_div.add(value.facultyName,'b');
                research_div.add(value.username,'p');

                // add up citations
                research_div.createList(c_faculty);
                $.each(value.citations,function (index, value) {
                    research_div.addToList(c_faculty, research_div.format(value,'p'),'li');
                });

                // add citations
                research_div.add( research_div.listToHtml(c_faculty,'ul') , 'div');


            });


            // add up the byIntrestArea section
            $.each(byIntrest,function (index, value) {
                research_div.add(value.areaName,'p');

                // add up citations
                research_div.createList(c_intrest);
                $.each(value.citations,function (index, value) {
                    research_div.addToList( c_intrest, research_div.format(value,'p') , 'li' );
                });

                // add citations
                research_div.add( research_div.listToHtml(c_intrest,'ul') , 'div');
            });



            $('#research').html(research_div.getHtml());
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





