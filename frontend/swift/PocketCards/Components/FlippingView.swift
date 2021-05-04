//
//  FlippingView.swift
//  VIPERDemo
//
//  Created by macmini on 2021/04/14.
//

import SwiftUI

struct FlippingView: View {
    @State private var flipped = false
    @State private var angle:Double = 0
    private var frontView: AnyView
    private var backView: AnyView
    
    init(frontView: AnyView, backView: AnyView) {
        self.frontView = frontView
        self.backView = backView
    }
    
    var body: some View {
        
        return VStack {
//            Spacer()
            
            ZStack() {
                self.frontView.opacity(flipped ? 0.0 : 1.0)
                self.backView.opacity(flipped ? 1.0 : 0.0)
            }
            .modifier(FlipEffect(flipped: $flipped, angle: angle, axis: (x: 0, y: 1)))
            .onTapGesture {
                withAnimation(Animation.spring()) {
                    self.angle += 180
                }
                withAnimation(nil) {
                    if self.angle >= 360 {
                        self.angle = self.angle.truncatingRemainder(dividingBy: 360)
                    }
                }
            }
//            Spacer()
        }
    }
}

struct FlipEffect: GeometryEffect {
    
    var animatableData: Double {
        get { angle }
        set { angle = newValue }
    }
    
    @Binding var flipped: Bool
    var angle: Double
    let axis: (x: CGFloat, y: CGFloat)
    
    func effectValue(size: CGSize) -> ProjectionTransform {
        
        DispatchQueue.main.async {
            self.flipped = self.angle >= 90 && self.angle < 270
        }
        
        let tweakedAngle = flipped ? -180 + angle : angle
        let a = CGFloat(Angle(degrees: tweakedAngle).radians)
        
        var transform3d = CATransform3DIdentity;
        transform3d.m34 = -1/max(size.width, size.height)
        
        transform3d = CATransform3DRotate(transform3d, a, axis.x, axis.y, 0)
        transform3d = CATransform3DTranslate(transform3d, -size.width/2.0, -size.height/2.0, 0)
        
        let affineTransform = ProjectionTransform(CGAffineTransform(translationX: size.width/2.0, y: size.height / 2.0))
        
        return ProjectionTransform(transform3d).concatenating(affineTransform)
    }
}

struct FlippingView_Previews: PreviewProvider {
    static var previews: some View {
        let frontView = FrontCard(text: "AA")
        let backView = BackCard(text: "BBB")
        
        FlippingView(frontView: AnyView(frontView), backView: AnyView(backView))
//        FlippingView()
    }
}
