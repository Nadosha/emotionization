import { FilesCollection } from 'meteor/ostrio:files';

Covers = new FilesCollection({
    collectionName: 'covers',
    storagePath: () => {
        return `${process.env.PWD}/uploads`;
    },
    allowClientCode: false, // Disallow remove files from Client
    onBeforeUpload(file) {
        // Allow upload files under 10MB, and only in png/jpg/jpeg formats
        if (file.size <= 10485760 && /png|jpg|jpeg/i.test(file.extension)) {
            return true;
        } else {
            return 'Please upload image, with size equal or less than 10MB';
        }
    }
});