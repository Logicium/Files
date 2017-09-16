var NewFolder = function (name) {

    var prototype = {Name:''};
    var self = this;
    this.viewFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle('Add '+name);

    this.uploadInput = input('Folder','file').css('display','none').attr('webkitdirectory','webkitdirectory').attr('multiple','multiple').change(function(){
        var formData = new FormData();
        var inputVal = $(this).get(0).files;
        for(var i in inputVal){
            formData.append('file',inputVal[i]);
        }

        var parentFolderPath = '';
        $.each($('.naviName'),function(){
            var name = $(this).text();
            parentFolderPath = parentFolderPath+'/'+name;
        });
        var newFolderName = inputVal[0].webkitRelativePath.split('/')[0];
        parentFolderPath = parentFolderPath.substring(0,parentFolderPath.lastIndexOf('/New Folder')) + '/'+newFolderName;
        formData.append('token',Token);
        formData.append('path',parentFolderPath);
        console.log(parentFolderPath);
        $.post('/files/newFolder',{token:Token,path:parentFolderPath},function(data){
            $.ajax({
                url:'/files/uploadFiles',
                type: 'POST',
                data:formData,
                processData: false,
                contentType: false,
                success:function(data){
                    swal.resetDefaults();
                    swal({title:JSON.parse(data).message,text:JSON.stringify(JSON.parse(data).err),type:JSON.parse(data).type});

                }
            });
        });

    });

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

    return this.viewFilePanel.append(
        this.panelTitleBar,
        this.upload,
        this.uploadInput,
        this.or,
        this.inputs,
        this.submit
    );

};
