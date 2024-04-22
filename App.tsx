/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  getPermissionStatus,
  requestPermissions,
  onTokenReceived,
  OnTokenReceivedInput,
  OnTokenReceivedOutput,
  initializePushNotifications,
} from 'aws-amplify/push-notifications';
import {signIn, signOut} from 'aws-amplify/auth';

import {ConsoleLogger} from 'aws-amplify/utils';
ConsoleLogger.LOG_LEVEL = 'DEBUG';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  async function handleSignOut() {
    try {
      await signOut();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  async function handleSignIn() {
    try {
      const {isSignedIn, nextStep} = await signIn({
        username: '',
        password: '',
      });
    } catch (error) {
      console.log('error signing in', error);
    }
  }
  async function handlePermissions() {
    const status = await getPermissionStatus();
    if (status === 'granted') {
      // no further action is required, user has already granted permissions
      console.log('GRANTED');
      return;
    }
    if (status === 'denied') {
      // further attempts to request permissions will no longer do anything
      console.log('DENIED');
      return;
    }
    if (status === 'shouldRequest') {
      // go ahead and request permissions from the user
      await requestPermissions();
    }
  }

  async function init() {
    console.log('Init');

    await handleSignOut();
    await handleSignIn();
    await handlePermissions();

    const myTokenReceivedHandler: OnTokenReceivedInput = token => {
      // Do something with the received token
      console.log('Token');
      console.log(token);
    };

    const listener: OnTokenReceivedOutput = onTokenReceived(
      myTokenReceivedHandler,
    );

    listener.remove(); // Remember to remove the listener when it is no longer needed
  }

  useEffect(() => {
    try {
      initializePushNotifications();
      init();
    } catch (e) {
      console.log('INIT ERROR');
      console.log(e);
    }
  }, []);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
