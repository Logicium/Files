var NewFolder = function (name,folderPath) {

    var prototype = {Name:''};
    var self = this;
    this.viewFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle('Add '+name);
    this.uploadLoad = button('').append(icon('sync')).css('font-size','18px').css('margin','0').css('max-width','100%').removeClass('cta').addClass('uploadLoad animated rotateY infinite rev text-center').width('100%');
    this.uploadInput = input('Folder','file').css('display','none').attr('webkitdirectory','webkitdirectory').attr('multiple','multiple').change(function(){
        $('.uploadButton').replaceWith(this.uploadLoad);
        var formData = new FormData();
        var inputVal = $(this).get(0).files;
        var newFolderName = inputVal[0].webkitRelativePath.split('/')[0];
        formData.append('token',Token);
        $.post('/files/newFolder',{token:Token,name:newFolderName,folder:folderPath},function(data){
          formData.append('folder',data.folder);
          for(var i in inputVal){
            formData.append('file',inputVal[i]);
          }
            $.ajax({
                url:'/files/uploadFiles',
                type: 'POST',
                data:formData,
                processData: false,
                contentType: false,
                success:function(data){
                    swal.resetDefaults();
                    $('.uploadLoad').replaceWith(self.upload);
                    swal({title:JSON.parse(data).message,text:JSON.stringify(JSON.parse(data).err),type:JSON.parse(data).type});

                }
            });
        });

    });

    this.upload =  button('Upload '+name).css('font-size','18px').css('margin','0').css('max-width','100%').removeClass('cta').addClass('uploadButton rev text-center').width('100%').click(function(){
        self.uploadInput.click();
    });

    this.or = div().width('100%').addClass('text-center').append(highlightText('Or')).css('font-size','26px').css('padding','20px');
    this.submit = button('Create new '+name).css('font-size','18px').css('margin','0').css('max-width','100%').addClass('cta text-center').width('100%').click(function(){

        var inputs = $('input');
        var inputObject = {};
        $.each(inputs,function () { inputObject[ $(this).attr('placeholder').toLowerCase() ] = $(this).val(); });

        $.post('/files/newFolder',{token:Token,name:inputObject.name,folder:folderPath},function(data){
            swal.resetDefaults();
            swal({title:data.message,type:data.type,timer:3000});
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
