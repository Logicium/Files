var FaceMatrix = function(faces){
    this.faceMatrix = div().addClass('faceMatrix').css('perspective','100em');

    this.faceMatrix.append(new FacePanel(faces));

    return this.faceMatrix;
};

var FacePanel = function (FaceData) {

    this.facePanel = div().css('position','absolute').addClass('facePanel').css('background',transparentWhite())
        .css('padding','10px').css('margin','10px').css('min-height','600px').css('width','95%');
    this.buttonClick = function(formInputs){

        var formData = formInputs;

        return function(){
            var parentButton = $(this);
            var parentMatrix = parentButton.parent().parent().parent();
            parentMatrix.prepend(new GridFace())
        }

    };

    this.searchBar = input('Search '+FaceData.children.length+' items in '+FaceData.name);

    this.newFolderButton = buttonCol('Add Folders','folder',3).removeClass('cta').addClass('rev').css('color',transparentBlack()).click(function(){

        var newfolderData = {name:'Folders'};

        var nr = new NaviRow('New '+newfolderData.name);
        $('.levelNavi').append(nr.playKeyframe(
            {name:'expand-height',duration:'1s',timingFunction:'ease'},function(){
                $.each($('.naviRow'),function () {
                    $(this).resetKeyframe(function(){});
                    setTimeout(function(){$($(this).find('.levelFace')).resetKeyframe(function(){});},1000);
                });
                $('.levelFace:last').playKeyframe(
                    {name:'new-level',duration:'1s',timingFunction:'ease'}
                );
            }));

        var transformValue = 0;
        $.each( $('.facePanel') ,function(){
            transformValue = transformValue - 1500;
            $(this).css('z-index',transformValue).css('transition','2s ease').css('animation-delay',transformValue/10+'ms')
                .css({'transform':'translateY(300px) translateZ('+transformValue+'px)'});
        });

        $('.faceMatrix').prepend(new NewFolder(newfolderData.name).playKeyframe({
            name:'new-panel',duration:'1s',timingFunction:'ease',complete:function(){$(this).resetKeyframe()}
        }));

    });

    this.newFileButton = buttonCol('Add Files','file',3).removeClass('cta').addClass('rev').css('color',transparentBlack()).click(function(){
        var newData = {name:'Files'};

        var nr = new NaviRow('New '+newData.name);
        $('.levelNavi').append(nr.playKeyframe(
            {name:'expand-height',duration:'1s',timingFunction:'ease'},function(){
                $.each($('.naviRow'),function () {
                    $(this).resetKeyframe(function(){});
                    setTimeout(function(){$($(this).find('.levelFace')).resetKeyframe(function(){});},1000);
                });
                $('.levelFace:last').playKeyframe(
                    {name:'new-level',duration:'1s',timingFunction:'ease'}
                );
            }));

        var transformValue = 0;
        $.each( $('.facePanel') ,function(){
            transformValue = transformValue - 1500;
            $(this).css('z-index',transformValue).css('transition','2s ease').css('animation-delay',transformValue/10+'ms')
                .css({'transform':'translateY(300px) translateZ('+transformValue+'px)'});
        });

        $('.faceMatrix').prepend(new NewFile(newData.name).playKeyframe({
            name:'new-panel',duration:'1s',timingFunction:'ease',complete:function(){$(this).resetKeyframe()}
        }));

    });

    this.sortButton = buttonCol('Sort','sync',3).css('color','white');

    this.orderButton = buttonCol('Ascending','arrow-up',3).css('color','white');

    this.toolBar = row();
    this.directories = div();
    this.files = row();

    for(var index in FaceData.children){

        if(FaceData.children[index].type === 'folder'){
            this.directories.append(new DirectoryCard(FaceData.children[index]))
        }
        else if(FaceData.children[index].type === 'file'){
            this.files.append(new FileCard(FaceData.children[index]))
        }
    }

    return this.facePanel.append(
        this.searchBar,
        this.toolBar.append(
            this.newFolderButton,
            this.newFileButton,
            this.sortButton,
            this.orderButton
        ),
        this.directories,
        this.files
    )
};