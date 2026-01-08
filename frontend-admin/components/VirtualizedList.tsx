import { FixedSizeList as List } from 'react-window';
import { useRef, useCallback } from 'react';

interface VirtualizedListProps<T> {
    items: T[];
    itemHeight: number;
    height: number;
    renderItem: (item: T, index: number) => React.ReactNode;
    onLoadMore?: () => void;
    hasMore?: boolean;
    isLoading?: boolean;
}

/**
 * Virtualized List Component
 * Renders only visible items for better performance with large lists
 * 
 * @example
 * <VirtualizedList
 *   items={products}
 *   itemHeight={100}
 *   height={600}
 *   renderItem={(product) => <ProductCard product={product} />}
 * />
 */
export function VirtualizedList<T>({
    items,
    itemHeight,
    height,
    renderItem,
    onLoadMore,
    hasMore,
    isLoading,
}: VirtualizedListProps<T>) {
    const listRef = useRef<List>(null);

    const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
        const item = items[index];

        // Load more when near bottom
        if (onLoadMore && hasMore && !isLoading && index === items.length - 5) {
            onLoadMore();
        }

        return (
            <div style={style}>
                {renderItem(item, index)}
            </div>
        );
    }, [items, renderItem, onLoadMore, hasMore, isLoading]);

    return (
        <List
            ref={listRef}
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
            overscanCount={5} // Render 5 extra items for smooth scrolling
        >
            {Row}
        </List>
    );
}

/**
 * Grid Virtualized List
 * For grid layouts (e.g., product cards in a grid)
 */
interface VirtualizedGridProps<T> {
    items: T[];
    itemHeight: number;
    itemWidth: number;
    height: number;
    columns: number;
    renderItem: (item: T, index: number) => React.ReactNode;
}

export function VirtualizedGrid<T>({
    items,
    itemHeight,
    itemWidth,
    height,
    columns,
    renderItem,
}: VirtualizedGridProps<T>) {
    const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
        const startIndex = index * columns;
        const endIndex = Math.min(startIndex + columns, items.length);
        const rowItems = items.slice(startIndex, endIndex);

        return (
            <div style={{ ...style, display: 'flex', gap: '1rem' }}>
                {rowItems.map((item, i) => (
                    <div key={startIndex + i} style={{ width: itemWidth }}>
                        {renderItem(item, startIndex + i)}
                    </div>
                ))}
            </div>
        );
    };

    const rowCount = Math.ceil(items.length / columns);

    return (
        <List
            height={height}
            itemCount={rowCount}
            itemSize={itemHeight}
            width="100%"
        >
            {Row}
        </List>
    );
}
