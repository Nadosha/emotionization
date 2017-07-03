import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import Dropzone from 'dropzone';
import { Session } from 'meteor/session';

Template.fileUploader.onCreated(function() {
    Meteor.subscribe('covers');
    this.isUploading = new ReactiveVar(false);
    this.uploadingProgress = new ReactiveVar(0);

    let emotionId = Router.current().params._id;
    let imgIDs = emotionId ? Emotions.findOne(emotionId).img : [];

    this.filesId = new ReactiveVar(imgIDs);

    this.collection = Covers;
});

Template.fileUploader.onRendered(function () {
    let myDropzone = new Dropzone("#dropzone-files", {
        url: ".",
        acceptedFiles: "image/*,.pdf",
        autoProcessQueue: false
    });
    let templateInstance = this;

    let arr = this.filesId.get();

    let self = this;
    myDropzone.on("addedfile", function(file) {
        let upload = templateInstance.collection.insert({
            file: file,
            streams: 'dynamic',
            chunkSize: 'dynamic',
            meta: {user: Meteor.userId()}
        }, false);

        upload.on('start', ()=> {
            templateInstance.isUploading.set(true);
        }).on('progress', ()=> {
            templateInstance.uploadingProgress.set(upload.progress.get());
        }).on('end', (error, fileObj)=> {

            if (error) {
                toastr.error('Error during upload: ' + error);
            } else {
                toastr.success('File "' + fileObj.name + '" successfully uploaded');
            }

            arr.push(fileObj._id);
            self.filesId.set(arr);
            Session.set('imageFileObjID', arr);
        });

        upload.start();
    });
});

Template.fileUploader.helpers({
    uploadingProcess: function() {
        let templateInstace = Template.instance();
        let percentage = templateInstace.uploadingProgress.get();
        let upload = templateInstace.isUploading.get();

        $('#fileLoadProcess').css('width', percentage + '%');

        if (percentage == 100){
            setTimeout(function() {
                templateInstace.isUploading.set(false);
            }, 1000);
        }

        return {
            isUploaded: upload,
            percentage: percentage
        }
    }
});

Template.fileUploader.events({
    'change #fileInput': function (event, templateInstance) {
        let arr = templateInstance.filesId.get();

        if (event.currentTarget.files && event.currentTarget.files[0]) {
            _.each(event.currentTarget.files, (file) => {
                const upload = Covers.insert({
                    file: file,
                    streams: 'dynamic',
                    chunkSize: 'dynamic',
                    meta: {user: Meteor.userId()}
                }, false);
                upload.on('start', function () {
                    templateInstance.isUploading.set(this);
                });
                upload.on('end', function (error, fileObj) {
                    if (error) {
                        toastr.error('Error during upload: ' + error);
                    } else {
                        arr.push(fileObj._id);
                        Session.set('imageFileObjID', arr);
                        toastr.success('File "' + fileObj.name + '" successfully uploaded');
                    }
                    templateInstance.isUploading.set(false);
                });
                upload.start();
            });
        }
    }
});
