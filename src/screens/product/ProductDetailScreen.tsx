// src/screens/home/ProductDetailScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import Layout from '../../components/Layout';
import SubHeader from '../../components/SubHeader';

type Props = NativeStackScreenProps<MainStackParamList, 'ProductDetail'>;

export default function ProductDetailScreen({ route, navigation }: Props) {
  const { productId } = route.params;

  return (
    <Layout>
      <SubHeader
        headerLabel="상품 상세"
        headerLeftOnPress={() => navigation.goBack()}
      />

      <Text style={[styles.title]}>상품 상세</Text>
      <Text style={[styles.id]}>ID: {productId}</Text>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  backButton: { marginTop: 60, marginBottom: 24 },
  backText: { fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  id: { fontSize: 16 },
});
