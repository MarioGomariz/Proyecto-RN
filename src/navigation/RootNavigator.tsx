import { View, ActivityIndicator, StyleSheet} from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import DashboardScreen from '../screens/admin/DashboardScreen';
import ProfileScreen from '../screens/admin/ProfileScreen';
import AddProductScreen from '../screens/admin/AddProductScreen';
import ListProductsScreen from '../screens/admin/ListProductsScreen';
import ProductDetailScreen from '../screens/admin/ProductDetailScreen';
import StockMovementScreen from '../screens/admin/StockMovementScreen';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function InventarioTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
      }}
    >
      <Tab.Screen
        name="ListProductsTab"
        component={ListProductsScreen}
        options={{
          title: 'Inventario',
          tabBarLabel: 'Lista',
          tabBarIcon: ({ color, size }) => <Ionicons name="list-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="AddProductTab"
        component={AddProductScreen}
        options={{
          title: 'Nuevo Producto',
          tabBarLabel: 'Añadir',
          tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="StockMovementTab"
        component={StockMovementScreen}
        options={{
          title: 'Movimiento de Stock',
          tabBarLabel: 'Movimiento',
          tabBarIcon: ({ color, size }) => <Ionicons name="swap-horizontal-outline" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}


function MainDrawer() {
  const { colors } = useTheme();

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: colors.background },
        drawerActiveTintColor: colors.primary,
        drawerInactiveTintColor: colors.textSecondary,
        drawerLabelStyle: { fontWeight: '600' },
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Inicio',
          drawerIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Agregar Producto"
        component={AddProductScreen}
        options={{
          title: 'Agregar Producto',
          drawerIcon: ({ color, size }) => <Ionicons name="add-circle-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Inventario"
        component={InventarioTabs}
        options={{
          title: 'Inventario',
          drawerIcon: ({ color, size }) => <Ionicons name="cube-outline" color={color} size={size} />,
        }}
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          title: 'Mi Perfil',
          drawerIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
    </Drawer.Navigator>
  );
}


export default function RootNavigator() {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen name="MainDrawer" component={MainDrawer} />
          <Stack.Screen
            name="ProductDetail"
            component={ProductDetailScreen}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
