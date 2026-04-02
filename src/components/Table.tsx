// components/Table.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import CommonText from './CommonText';
import { colors } from '../constants/colors';
import { fonts } from '../constants/fonts';

type CellWidth = number | undefined;

const ThCell = ({ label, width }: { label: string; width?: CellWidth }) => (
  <View style={[styles.th, width ? { width } : {}]}>
    <CommonText labelText={label} labelTextStyle={[styles.thText]} />
  </View>
);

const TdCell = ({ label, width }: { label: string; width?: CellWidth }) => (
  <View style={[styles.td, width ? { width } : {}]}>
    <CommonText labelText={label} labelTextStyle={[styles.tdText]} />
  </View>
);

export type TableColumn = {
  key: string;
  label: string;
  width?: number;
};

export type TableRowData = Record<string, string>;

export const TableHeader = ({ columns }: { columns: TableColumn[] }) => (
  <View style={{ flexDirection: 'row' }}>
    {columns.map(col => (
      <ThCell key={col.key} label={col.label} width={col.width} />
    ))}
  </View>
);

export const TableRow = ({
  columns,
  data,
}: {
  columns: TableColumn[];
  data: TableRowData;
}) => (
  <View style={{ flexDirection: 'row' }}>
    {columns.map(col => (
      <TdCell key={col.key} label={data[col.key] ?? ''} width={col.width} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  th: {
    minWidth: 80,
    height: 32,
    backgroundColor: colors.gray1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  thText: {
    fontSize: 12,
    ...fonts.medium,
    color: colors.gray8,
  },
  td: {
    minWidth: 80,
    minHeight: 46,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tdText: {
    fontSize: 14,
    color: colors.gray9,
  },
});
