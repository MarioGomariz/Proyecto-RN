import { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { productService } from '../../services/productService';
import { spacing, typography, borderRadius } from '../../constants/theme';
import AnimatedScreen from '../../components/AnimatedScreen';

export default function ListProductsScreen({ navigation }: any) {
  const { colors } = useTheme();
  
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productService.getProducts();
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener tags únicos
  const uniqueTags = Array.from(new Set(products.map(p => p.tag).filter(Boolean)));

  const filteredProducts = products.filter(p => {
    const matchesTag = selectedTag ? p.tag === selectedTag : true;
    const term = searchQuery.toLowerCase();
    const matchesSearch = term ? 
      (p.nombre?.toLowerCase().includes(term) || 
       p.descripcion?.toLowerCase().includes(term)) : true;
       
    return matchesTag && matchesSearch;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
      onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
    >
      <View style={[styles.iconContainer, { backgroundColor: colors.primary + '15' }]}>
        <Ionicons name="cube-outline" size={24} color={colors.primary} />
      </View>
      <View style={styles.cardInfo}>
        <Text style={[typography.heading3, { color: colors.text, fontSize: 16 }]} numberOfLines={1}>
          {item.nombre}
        </Text>
        <Text style={[typography.bodySmall, { color: colors.textSecondary, marginTop: 4 }]}>
          Stock: {item.stock_actual} • Tag: {item.tag}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <AnimatedScreen>
      <SafeAreaView style={styles.safe}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else if (typeof navigation.openDrawer === 'function') {
                navigation.openDrawer();
              }
            }} 
            style={styles.backButton}
          >
            <Ionicons 
              name={navigation.canGoBack() ? "arrow-back" : "menu-outline"} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
          <Text style={[typography.heading3, { color: colors.text, flex: 1, textAlign: 'center' }]}>
            Lista de Productos
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }]}
            placeholder="Buscar por nombre, descripción o código..."
            placeholderTextColor={colors.textDisabled}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tags Filter */}
        {uniqueTags.length > 0 && (
          <View style={styles.tagsContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: spacing.md, gap: 8 }}>
              <TouchableOpacity
                style={[
                  styles.tagChip,
                  !selectedTag ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }
                ]}
                onPress={() => setSelectedTag(null)}
              >
                <Text style={[typography.label, { color: !selectedTag ? '#fff' : colors.textSecondary }]}>Todos</Text>
              </TouchableOpacity>
              
              {uniqueTags.map(tag => (
                <TouchableOpacity
                  key={tag as string}
                  style={[
                    styles.tagChip,
                    selectedTag === tag ? { backgroundColor: colors.primary, borderColor: colors.primary } : { backgroundColor: colors.surface, borderColor: colors.border }
                  ]}
                  onPress={() => setSelectedTag(tag as string)}
                >
                  <Text style={[typography.label, { color: selectedTag === tag ? '#fff' : colors.textSecondary }]}>
                    {tag as string}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* List Content */}
        <View style={styles.content}>
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: spacing.xl }} />
          ) : filteredProducts.length === 0 ? (
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: 'center', marginTop: spacing.xl }]}>
              No hay productos que coincidan.
            </Text>
          ) : (
            <FlatList
              data={filteredProducts}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>
      </SafeAreaView>
    </AnimatedScreen>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: spacing.xs,
    width: 40,
  },
  searchContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.md + 12,
    zIndex: 1,
  },
  searchInput: {
    ...typography.body,
    paddingLeft: 40,
    paddingRight: spacing.md,
    paddingVertical: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  tagsContainer: {
    paddingVertical: spacing.sm,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  content: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
});
