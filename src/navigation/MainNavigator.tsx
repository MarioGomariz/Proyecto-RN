import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import TabNavigator from './TabNavigator';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();

export default function MainNavigator() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.header },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        drawerStyle: { backgroundColor: colors.card },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerActiveBackgroundColor: colors.primaryLight,
        drawerLabelStyle: { fontWeight: '600', fontSize: 15 },
      }}
    >
      <Drawer.Screen
        name="App"
        component={TabNavigator}
        options={{
          title: 'Mi App aaaa',
          drawerLabel: 'Inicio',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" color={color} size={size} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
