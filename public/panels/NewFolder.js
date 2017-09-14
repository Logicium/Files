var NewFolder = function (name) {

    var prototype = {Name:''};
    var self = this;
    this.newFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle('Add '+name);
    this.uploadInput = input('Folder','file').css('display','none').attr('webkitdirectory','webkitdirectory').attr('multiple','multiple');
    this.upload =  button('Upload '+name).css('font-size','18px').css('margin','0').css('max-width','100%').removeClass('cta').addClass('rev text-center').width('100%').click(function(){
        self.uploadInput.click();
    });

    this.or = div().width('100%').addClass('text-center').append(highlightText('Or')).css('font-size','26px').css('padding','20px');
    this.submit = button('Create new '+name).css('font-size','18px').css('margin','0').css('max-width','100%').addClass('cta text-center').width('100%').click(function(){

        var inputs = $('input');
        var inputObject = {};
        $.each(inputs,function () { inputObject[ $(this).attr('placeholder') ] = $(this).val(); });


        var parentFolderPath = '';
        $.each($('.naviName'),function(){
            var name = $(this).text();
            console.log(name);
            parentFolderPath = parentFolderPath+'/'+name;
        });
        parentFolderPath = parentFolderPath.substring(0,parentFolderPath.lastIndexOf('/New Folder')) + '/'+inputObject.Name;
        console.log(parentFolderPath);

        $.post('/files/newFolder',{token:Token,path:parentFolderPath},function (data) {
            swal.resetDefaults();
            swal({title:data.message,type:data.type,timer:2000});
        });

    });

    this.inputs = div();

    for(var k in prototype){
        this.inputs.append(new input(k))
    }

    return this.newFilePanel.append(
        this.panelTitleBar,
        this.upload,
        this.uploadInput,
        this.or,
        this.inputs,
        this.submit
    );

};
