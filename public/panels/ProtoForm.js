var ProtoForm = function (name,prototype) {
    this.protoForm = panel();
    this.inputs = div();

    this.submit = button('Submit new '+name).css('font-size','18px').css('margin','0').css('max-width','100%').addClass('cta text-center').width('100%').click(function(){
        var inputs = $('input');
        var inputObject = {};
        $.each(inputs,function () { inputObject[ $(this).attr('placeholder') ] = $(this).val(); });

        // var pathName = path.substring(1);
        // console.log(pathName);
        //
        // var fullPath = configSection+'.data.'+pathName;
        // console.log(fullPath);
        //
        // var configName = Config[configSection].name;
        // var existingData = _.find(Config,{name:configName}).data[pathName];
        // existingData.push(inputObject);
        //
        // _.set(Config,fullPath.split('.'),existingData);
        // var parentTitle = Config[configSection].name;
        //
        // var data = {
        //     parentTitle:parentTitle,
        //     key:key,newConfig:Config,parentIndex:configSection,token:Token
        // };
        // console.log(data);
        //
        // $.post('/files/update',data,function (data) {
        //     swal.resetDefaults();
        //     swal({title:data.message,type:'success',timer:2000});
        //
        //     $('.contentPanel').replaceWith(
        //         new Props(configSection)
        //     );
        // });

    });

    for(var k in prototype){
        this.inputs.append(new input(k))
    }

    return this.protoForm.append(
        this.inputs,
        this.submit
    )
};