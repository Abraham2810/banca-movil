import React from 'react';
import Svg, { Path } from 'react-native-svg';

export default function TopBackground() {
    return (
        <Svg xmlns="http://www.w3.org/2000/svg" width={390} height={388} fill="none">
            <Path
                fill="#6F028A"
                d="M-1.654.654c.13-.416.5-.654.937-.654h392.75a1 1 0 0 1 1 1v355.2c0 1.194 1.653.95 1.859-.226 32.267-183.72-315.407 113.317-396.341 9.263C-81.286 262.594-6.113 15.029-1.654.654Z"
            />
        </Svg>
    );
}