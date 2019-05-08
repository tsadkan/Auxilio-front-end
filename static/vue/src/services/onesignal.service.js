
import { UserAccountAPI } from '@/api';
import { AuthService } from '@/services';

let OneSignal;

export default class OnesignalService {
    static onesignalKey = 'ONE_SIGNAL';

    static onesignalId = localStorage.getItem(OnesignalService.onesignalKey);

    constructor() {
      console.log('OneSignal Service Init', OnesignalService.onesignalId);
    }

    init() {
      if (OnesignalService.onesignalId) {
        console.log('Onesignal already Initialized');
      } else {
        this.addScript('https://cdn.onesignal.com/sdks/OneSignalSDK.js', () => {
          console.log('OneSignal Script Loaded');
          this.initOneSignal();
        });
      }
    }

    // eslint-disable-next-line
    addScript(fileSrc, callback) {
      const head = document.getElementsByTagName('head')[0];
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = callback;
      script.src = fileSrc;
      head.appendChild(script);
    }

    initOneSignal() {
      OneSignal = window.OneSignal || [];

      console.log(OneSignal);
      console.log('Init OneSignal');
      OneSignal.push(['init', {
        appId: '5a5f1006-c649-4c16-9efe-4f39feb37961',
        autoRegister: true,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: {
          enable: false,
        },
      }]);
      console.log('OneSignal Initialized.......');
      this.checkIfSubscribed();
    }

    subscribe() {
      OneSignal.push(() => {
        console.log('Register For Push');
        OneSignal.push(['registerForPushNotifications']);
        OneSignal.on('subscriptionChange', (isSubscribed) => {
          console.log('The user\'s subscription state is now:', isSubscribed);
          this.listenForNotification();
          OneSignal.getUserId().then((userId) => {
            console.log('User ID is', userId);
            const { id } = AuthService.getProfile();
            UserAccountAPI.subscribeForNotification({ deviceToken: userId, userId: id }).then((res) => {
              console.log(res);
            });
            console.log({ key: OnesignalService.onesignalKey, userId });
            localStorage.setItem(OnesignalService.onesignalKey, userId);
          });
        });
      });
    }

    listenForNotification() {
      console.log('Initalize Listener');
      OneSignal.on('notificationDisplay', (event) => {
        console.log('OneSignal notification displayed:', event);
        this.listenForNotification();
      });
    }

    // eslint-disable-next-line
    getUserID() {
      OneSignal.getUserId().then((userId) => {
        console.log('User ID is', userId);
        localStorage.setItem(OnesignalService.onesignalKey, userId);
      });
    }

    checkIfSubscribed() {
      OneSignal.push(() => {
        OneSignal.isPushNotificationsEnabled((isEnabled) => {
          if (isEnabled) {
            console.log('Push notifications are enabled!');
            this.getUserID();
          } else {
            console.log('Push notifications are not enabled yet.');
            this.subscribe();
          }
        }, (error) => {
          console.log('Push permission not granted', error);
        });
      });
    }
}
