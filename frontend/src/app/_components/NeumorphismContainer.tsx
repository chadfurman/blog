"use client"
import styled from "styled-components";

export const NeumorphismCard = styled.div`
    background: color-mix(in srgb, rgb(var(--background)), white 10%);
    border-radius: 16px;
    box-shadow: 4px 4px 32px color-mix(in srgb, rgb(var(--background)), rgb(var(--outset-box-shadow-lowlight)) 5%),
    -6px -6px 16px color-mix(in srgb, rgb(var(--background)), rgb(var(--outset-box-shadow-highlght)) 5%),
    inset -4px -4px 2px color-mix(in srgb, rgb(var(--background)), rgb(var(--inset-box-shadow-highlight)) 10%),
    inset 4px 4px 2px color-mix(in srgb, rgb(var(--background)), rgb(var(--inset-box-shadow-lowlight)) 12%);
    padding: 20px;
    text-align: center;

    &:hover {
        box-shadow: 4px 4px 32px color-mix(in srgb, rgb(var(--background)), rgb(var(--outset-box-shadow-lowlight)) 5%),
        -4px -4px 24px color-mix(in srgb, rgb(var(--background)), rgb(var(--outset-box-shadow-highlght)) 25%),
        inset -4px -4px 2px color-mix(in srgb, rgb(var(--background)), rgb(var(--inset-box-shadow-highlight)) 10%),
        inset 4px 4px 2px color-mix(in srgb, rgb(var(--background)), rgb(var(--inset-box-shadow-lowlight)) 12%);
    }
`;

export const NeumorphismCardStatic = styled.div`
    background: color-mix(in srgb, rgb(var(--background)), white 10%);
    border-radius: 16px;
    box-shadow: 4px 4px 32px color-mix(in srgb, rgb(var(--background)), rgb(var(--outset-box-shadow-lowlight)) 5%),
    -6px -6px 16px color-mix(in srgb, rgb(var(--background)), rgb(var(--outset-box-shadow-highlght)) 5%),
    inset -4px -4px 2px color-mix(in srgb, rgb(var(--background)), rgb(var(--inset-box-shadow-highlight)) 10%),
    inset 4px 4px 2px color-mix(in srgb, rgb(var(--background)), rgb(var(--inset-box-shadow-lowlight)) 12%);
    padding: 20px;
    text-align: center;
`;

export default NeumorphismCard