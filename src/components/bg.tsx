"use client";

import React from "react";
import { useTheme } from "next-themes";

export function Bg() {
  const { theme, resolvedTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";

  return (
    <BgInternal
      color={isDark ? 0x202020 : 0xefefef}
      backgroundColor={isDark ? 0x090b0b : 0xffffff}
    />
  );
}

type BgProps = {
  color: number;
  backgroundColor: number;
};

class BgInternal extends React.Component<BgProps> {
  vantaRef = React.createRef<HTMLDivElement>();
  vantaEffect: any = null;

  componentDidMount() {
    this.init();
  }

  componentDidUpdate(prevProps: BgProps) {
    if (
      prevProps.color !== this.props.color ||
      prevProps.backgroundColor !== this.props.backgroundColor
    ) {
      this.destroy();
      this.init();
    }
  }

  init() {
    const waitForVanta = () => {
      if (!window.VANTA || !window.p5 || !this.vantaRef.current) {
        requestAnimationFrame(waitForVanta);
        return;
      }

      this.vantaEffect = window.VANTA.TOPOLOGY({
        el: this.vantaRef.current,
        p5: window.p5,
        mouseControls: true,
        touchControls: false,
        gyroControls: true,
        color: this.props.color,
        backgroundColor: this.props.backgroundColor,
      });

      this.vantaEffect.resize();
    };

    waitForVanta();
  }

  destroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
      this.vantaEffect = null;
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  render() {
    return (
      <div
        ref={this.vantaRef}
        className="fixed inset-0 w-screen h-screen -z-10"
      ></div>
    );
  }
}
