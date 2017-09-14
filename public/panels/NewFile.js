var NewFile = function (name) {

    var prototype = {Name:'',Type:''};
    var self = this;
    this.newFilePanel = dimensionalPanel();
    this.panelTitleBar = panelTitle('Add '+name);

    this.fileUploadInput = input('Files','file').css('display','none').attr('name','file').attr('multiple','multiple').change(function(){
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
        parentFolderPath = parentFolderPath.substring(0,parentFolderPath.lastIndexOf('/New Files'));

        formData.append('token',Token);
        formData.append('path',parentFolderPath);

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
    this.upload =  button('Upload '+name).css('font-size','18px').css('margin','0').css('max-width','100%')
        .removeClass('cta').addClass('rev text-center').width('100%').click(function(){
            self.fileUploadInput.click();
        });
    this.or = div().width('100%').addClass('text-center').append(highlightText('Or')).css('font-size','26px').css('padding','20px');
    this.submit = button('Create new '+name).css('font-size','18px').css('margin','0').css('max-width','100%').addClass('cta text-center').width('100%').click(function(){
        var inputs = $('input');
        var inputObject = {};
        $.each(inputs,function () { inputObject[ $(this).attr('placeholder') ] = $(this).val(); });

        // $.post('/files/newFiles',data,function (data) {
        //     swal.resetDefaults();
        //     swal({title:data.message,type:'success',timer:2000});
        //      //Dequeue panel
        // });

    });

    this.inputs = div();

    for(var k in prototype){
        this.inputs.append(new input(k))
    }

    return this.newFilePanel.append(
        this.panelTitleBar,
        this.upload,
        this.fileUploadInput,
        this.or,
        this.inputs,
        this.submit
    );

};
