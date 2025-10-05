import React from 'react';
import { Image } from 'expo-image';

const CachedImage = ({ source, ...props }) => {
    return (
        <Image
            source={source}
            cachePolicy="memory-disk"
            transition={200}
            contentFit="cover"
            {...props}
        />
    );
};

export default CachedImage;