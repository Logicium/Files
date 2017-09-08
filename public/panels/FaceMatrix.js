var FaceMatrix = function(faces){
    this.faceMatrix = div().addClass('faceMatrix').css('perspective','100em');

    this.faceMatrix.append(new FacePanel(faces));

    return this.faceMatrix;
};

var FacePanel = function (FaceData) {

    this.facePanel = div().css('position','absolute').addClass('facePanel').css('background',transparentWhiteHeavy())
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
    this.newFolderButton = buttonCol('New Folder','folder',3).removeClass('cta').addClass('ghost').css('color',transparentBlack());
    this.newFileButton = buttonCol('New File','file',3).removeClass('cta').addClass('ghost').css('color',transparentBlack());
    this.sortButton = buttonCol('Sort','sync',3).css('color','white');
    this.orderButton = buttonCol('Ascending','arrow-up',3).css('color','white');
    this.toolBar = row();
    this.items = div();

    for(var index in FaceData.children){

        if(FaceData.children[index].type === 'folder'){
            this.items.append(new DirectoryCard(FaceData.children[index]))
        }
        else if(FaceData.children[index].type === 'file'){
            this.items.append(new FileCard(FaceData.children[index]))
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
        this.items
    )
};