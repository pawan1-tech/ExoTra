import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../constants/theme';
import { AddEditTransactionScreen } from '../screens/AddEditTransactionScreen';
import { GoalsScreen } from '../screens/GoalsScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function AddActionPlaceholder() {
  return null;
}

function Tabs() {
  const insets = useSafeAreaInsets();
  const Colors = useThemeColors();

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => ({
        headerShown: false,
        sceneStyle: {
          paddingTop: insets.top
        },
        tabBarStyle: {
          position: 'absolute',
          left: 14,
          right: 14,
          bottom: Math.max(insets.bottom + 8, 14),
          height: 68,
          paddingTop: 8,
          paddingBottom: 8,
          borderTopWidth: 1,
          borderWidth: 1,
          borderColor: Colors.border,
          borderTopColor: Colors.border,
          borderRadius: 22,
          backgroundColor: Colors.tabBar,
          shadowColor: Colors.shadow,
          shadowOpacity: 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
          elevation: 8
        },
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarIcon: ({ color, size, focused }) => {
          let iconName = 'ellipse-outline';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Transactions') {
            iconName = focused ? 'swap-horizontal' : 'swap-horizontal-outline';
          } else if (route.name === 'Insights') {
            iconName = focused ? 'pie-chart' : 'pie-chart-outline';
          } else if (route.name === 'Goals') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'AddQuick') {
            iconName = 'add';
          }

          if (route.name === 'AddQuick') {
            return null;
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? 22 : size}
              color={color}
            />
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600'
        },
        tabBarItemStyle: {
          borderRadius: 16
        },
        tabBarButton:
          route.name === 'AddQuick'
            ? (props) => (
                <Pressable
                  {...props}
                  onPress={() => navigation.getParent()?.navigate('AddEditTransaction')}
                  style={{
                    position: 'absolute',
                    left: '50%',
                    marginLeft: -28,
                    top: -18,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: Colors.accent,
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 20,
                    shadowColor: Colors.shadow,
                    shadowOpacity: 0.22,
                    shadowRadius: 14,
                    shadowOffset: { width: 0, height: 10 },
                    elevation: 8,
                    borderWidth: 3,
                    borderColor: Colors.card
                  }}
                >
                  <Ionicons name="add" size={28} color={Colors.card} />
                </Pressable>
              )
            : undefined
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Transactions" component={TransactionsScreen} />
      <Tab.Screen
        name="AddQuick"
        component={AddActionPlaceholder}
        options={{
          tabBarLabel: ''
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.getParent()?.navigate('AddEditTransaction');
          }
        })}
      />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Goals" component={GoalsScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const scheme = useColorScheme();
  const Colors = useThemeColors();
  const navigationTheme = useMemo(() => {
    const baseTheme = scheme === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...baseTheme,
      colors: {
        ...baseTheme.colors,
        primary: Colors.accent,
        background: Colors.background,
        card: Colors.card,
        text: Colors.textPrimary,
        border: Colors.border,
        notification: Colors.accent
      }
    };
  }, [Colors, scheme]);

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator>
        <Stack.Screen name="MainTabs" component={Tabs} options={{ headerShown: false }} />
        <Stack.Screen
          name="AddEditTransaction"
          component={AddEditTransactionScreen}
          options={{
            title: 'Transaction',
            presentation: 'modal',
            animation: 'slide_from_bottom',
            headerStyle: { backgroundColor: Colors.card },
            headerShadowVisible: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
