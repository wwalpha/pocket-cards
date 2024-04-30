//
//  FlippingView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//

import SwiftUI

struct FlippingView: View {
    @State private var flipped = false
    @State private var angle: Double = 0

    var body: some View {
        VStack {
            Spacer()

            ZStack {
//               Text("Front side/表面").padding(5).frame(width: 300, height: 175, alignment: .center).background(Color.blue).opacity(flipped ? 0.0 : 1.0)
//               Text("Back side/裏面").padding(5).frame(width: 300, height: 175, alignment: .center).background(Color.red).opacity(flipped ? 1.0 : 0.0)

                Text("Front side/表面")
                    .frame(width: 500, height: 175, alignment: .center)
                    .font(.largeTitle)
                    .padding()
                    .border(Color.purple, width: 5)
                    .background(Color.red)
                    .opacity(flipped ? 0.0 : 1.0)

                Text("Back side/裏面")
                    .frame(width: 500, height: 175, alignment: .center)
                    .font(.largeTitle)
                    .padding()
                    .border(Color.purple, width: 5)
                    .background(Color.blue)
                    .opacity(flipped ? 1.0 : 0.0)

//               FrontCard().opacity(flipped ? 0.0 : 1.0)
//               BackCard().opacity(flipped ? 1.0 : 0.0)
            }
            .modifier(FlipEffect1(flipped: $flipped, angle: angle, axis: (x: 0, y: 1)))
            .onTapGesture {
                withAnimation(Animation.spring()) {
                    angle += 180
                }
                withAnimation(nil) {
                    if angle >= 360 {
                        angle = angle.truncatingRemainder(dividingBy: 360)
                    }
                }
            }
            Spacer()
        }
    }
}

struct FlipEffect1: GeometryEffect {
    var animatableData: Double {
        get { angle }
        set { angle = newValue }
    }

    @Binding var flipped: Bool
    var angle: Double
    let axis: (x: CGFloat, y: CGFloat)

    func effectValue(size: CGSize) -> ProjectionTransform {
        DispatchQueue.main.async {
            flipped = angle >= 90 && angle < 270
        }

        let tweakedAngle = flipped ? -180 + angle : angle
        let a = CGFloat(Angle(degrees: tweakedAngle).radians)

        var transform3d = CATransform3DIdentity
        transform3d.m34 = -1 / max(size.width, size.height)

        transform3d = CATransform3DRotate(transform3d, a, axis.x, axis.y, 0)
        transform3d = CATransform3DTranslate(transform3d, -size.width / 2.0, -size.height / 2.0, 0)

        let affineTransform = ProjectionTransform(CGAffineTransform(translationX: size.width / 2.0, y: size.height / 2.0))

        return ProjectionTransform(transform3d).concatenating(affineTransform)
    }
}

struct FrontCard: View {
    var body: some View {
        Text("Front side/表面").padding(5).frame(width: 300, height: 175, alignment: .center).background(Color.blue)
    }
}

struct BackCard: View {
    var body: some View {
        Text("Back side/裏面").padding(5).frame(width: 300, height: 175).background(Color.red)
    }
}
