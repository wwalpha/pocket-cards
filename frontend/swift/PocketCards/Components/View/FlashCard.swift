//
//  FlashCard.swift
//  PocketCards
//
//  Created by macmini on 2022/03/08.
//
import SwiftUI

struct FlashCard: View {
    @State private var flipped = false
    @State private var angle:Double = 0
    
    var question: String
    var answer: String
    var action: (_: Bool) -> Void

    var body: some View {
        GeometryReader { geo in
            VStack {
                ZStack {
                    Text(question)
                        .frame(width: geo.size.width * 0.8,  height: geo.size.height * 0.6, alignment: .center)
                        .font(.largeTitle)
                        .padding()
                        .border(Color.purple, width: 5)
                        .background(Color.grey100)
                        .opacity(flipped ? 0.0 : 1.0)
                    
                    Text(answer)
                        .frame(width: geo.size.width * 0.8,  height: geo.size.height * 0.6, alignment: .center)
                        .font(.largeTitle)
                        .padding()
                        .border(Color.purple, width: 5)
                        .background(Color.grey100)
                        .opacity(flipped ? 1.0 : 0.0)
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
                .padding(.horizontal,64)
                .padding(.vertical, 32)
                
                HStack {
                    Spacer()
                    
                    Button(action: {
                        self.action(false)
                        self.angle = 0.0
                    }, label: {
                        Text("知らない")
                            .frame(maxWidth: geo.size.width * 0.25, maxHeight: 64, alignment: .center)
                            .padding()
                            .font(.largeTitle)
                            .foregroundColor(Color.white)
                            .background(Color.red)
                    })
                    
                    Spacer()
                    
                    Button(action: {
                        self.action(true)
                        self.angle = 0.0
                    }, label: {
                        Text("知ってる")
                            .frame(maxWidth: geo.size.width * 0.25, maxHeight: 64, alignment: .center)
                            .padding()
                            .font(.largeTitle)
                            .foregroundColor(Color.white)
                            .background(Color.green)
                    })

                    Spacer()
                }
                .padding()
                
                Spacer()
            }
                .background(Color.grey50)
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

struct FlashCard_Previews: PreviewProvider {
    static var previews: some View {
        FlashCard(question: "Front Side", answer: "Back Side") { correct in
            print(correct)
        }
.previewInterfaceOrientation(.landscapeLeft)
    }
}
