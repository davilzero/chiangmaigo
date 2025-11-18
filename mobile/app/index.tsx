import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { Search, MapPin, Star, TrendingUp } from 'lucide-react-native'

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>ค้นหาบริการท่องเที่ยวเชียงใหม่</Text>
        <Text style={styles.heroSubtitle}>
          ศูนย์กลางสำหรับค้นหา จอง และจัดการบริการท่องเที่ยวท้องถิ่น
        </Text>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInput}>
            <Search size={20} color="#737373" />
            <Text style={styles.searchPlaceholder}>ค้นหาบริการท่องเที่ยว...</Text>
          </View>
          <TouchableOpacity style={styles.searchButton}>
            <Text style={styles.searchButtonText}>ค้นหา</Text>
          </TouchableOpacity>
        </View>
        
        {/* Advanced Search Button */}
        <TouchableOpacity style={styles.advancedSearchButton}>
          <Text style={styles.advancedSearchText}>การค้นหาขั้นสูง</Text>
        </TouchableOpacity>
      </View>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>หมวดหมู่บริการ</Text>
        <View style={styles.categoriesGrid}>
          {[
            { name: 'ทัวร์', icon: MapPin },
            { name: 'ที่พัก', icon: Star },
            { name: 'ร้านอาหาร', icon: TrendingUp },
            { name: 'กิจกรรม', icon: Star },
          ].map((category, index) => (
            <Link key={index} href={`/services?category=${category.name}`} asChild>
              <TouchableOpacity style={styles.categoryCard}>
                <category.icon size={32} color="#16a34a" />
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </View>
      </View>

      {/* Popular Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>บริการยอดนิยม</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3, 4].map((i) => (
            <Link key={i} href={`/services/${i}`} asChild>
              <TouchableOpacity style={styles.serviceCard}>
                <View style={styles.serviceImage} />
                <Text style={styles.serviceName}>บริการตัวอย่าง {i}</Text>
                <Text style={styles.servicePrice}>฿1,500</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>

      {/* AI Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>แนะนำโดย AI</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[1, 2, 3].map((i) => (
            <Link key={i} href={`/services/${i}`} asChild>
              <TouchableOpacity style={styles.serviceCard}>
                <View style={styles.serviceImage} />
                <Text style={styles.serviceName}>บริการแนะนำ {i}</Text>
                <Text style={styles.servicePrice}>฿1,500</Text>
              </TouchableOpacity>
            </Link>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  hero: {
    backgroundColor: '#16a34a',
    padding: 24,
    paddingTop: 48,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#dcfce7',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
  },
  searchPlaceholder: {
    color: '#a3a3a3',
  },
  searchButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  advancedSearchButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  advancedSearchText: {
    color: '#ffffff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#171717',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  categoryName: {
    marginTop: 8,
    fontWeight: '600',
    color: '#171717',
  },
  serviceCard: {
    width: 200,
    marginRight: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  serviceImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#e5e5e5',
    borderRadius: 8,
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#171717',
  },
  servicePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#16a34a',
  },
})


