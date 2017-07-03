import {SyncedCron} from 'meteor/percolate:synced-cron';
import { check } from 'meteor/check';

SyncedCron.config({
    collectionName: 'cronHistory'
});

let syncedCronAdd = function(doc) {
    SyncedCron.add({
        name: doc.title,
        schedule: function(parser) {
            return parser.text(doc.period); // change period for generating 'consolidated invoices'
        },
        job: function() {
            Meteor.call('removeEmotion', doc.emotion, doc.user, function(er, res) {
                if(!er)  Meteor.call('removeCronJob', doc.emotion);
            });
        }
    });
};

Meteor.startup(function() {
    CronJob.find().observe({
        added: function(doc) {
            syncedCronAdd(doc);
        },
        changed: function(doc) {
            console.log('changed', doc.emotion);
            SyncedCron.remove(doc);
            syncedCronAdd(doc);
        },
        removed: function(doc) {
            SyncedCron.remove(doc);
        }
    });

    CronJob.find().forEach(function(doc) {
        syncedCronAdd(doc);
    });

    SyncedCron.start();
});

Meteor.methods({
    addCronJob: function(emotionID) {
        check(emotionID, String);

        let emotion = Emotions.findOne(emotionID);

        CronJob.update(
            {
                emotion: emotionID
            },
            {
                $set: {
                    emotion: emotionID,
                    title: emotion.title,
                    user: emotion.user,
                    period: 'after 7 days'
                },
            },
            {upsert: true}
        );
    },
    removeCronJob: function(emotion) {
        check(emotion, String);

        CronJob.remove({
            emotion: emotion
        });
        SyncedCron.remove(emotion);
    },
    getParsedLater: function(string) {
        check(string, String);
        //for testing
        let schedules = later.parse.text(string);
        return later.schedule(schedules).next(7);
    }
});
