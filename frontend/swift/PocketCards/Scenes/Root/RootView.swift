//
//  RootView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import SwiftUI
import AVFoundation
import Kingfisher

struct RootView: View {
    private var router: RootRouter?

    var body: some View {
        let gradient1 = LinearGradient(
            colors: [Color.init(hex: 0x2193b0), Color.init(hex: 0x6dd5ed)],
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )
        let gradient2 = LinearGradient(
            colors: [Color.init(hex: 0xc21500), Color.init(hex: 0xffc500)],
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )
        
        VStack(alignment: .leading, spacing: 32) {
            Spacer()

            HStack {
                Text("国語")
                    .frame(height: 120, alignment: .topLeading)
                    .font(.system(size: 32))
                    .padding(.trailing, 64)
                
                NavigationLink(destination: router?.makeLanguageStudyiew()) {
                    Text("日々の演習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient1)
                        .foregroundColor(Color.white)
                }
                    .padding(.trailing, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                
                NavigationLink(destination: router?.makeLanguageTestView()) {
                    Text("日々のテスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient2)
                        .foregroundColor(Color.white)
                }
                    .padding(.leading, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                Spacer()
            }
                .padding(32)
                .background(
                    LinearGradient(
                        colors: [Color.init(hex: 0xf2b0b7), Color.init(hex: 0xfae3e5)],
                        startPoint: .topTrailing,
                        endPoint: .bottomLeading
                    )
                )
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

            HStack {
                Text("社会")
                    .frame(height: 120, alignment: .topLeading)
                    .font(.system(size: 32))
                    .padding(.trailing, 64)
                
                NavigationLink(destination: router?.makeSocietyStudyiew()) {
                    Text("日々の演習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient1)
                        .foregroundColor(Color.white)
                }
                    .padding(.trailing, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                
                NavigationLink(destination: router?.makeSocietyTestView()) {
                    Text("日々のテスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient2)
                        .foregroundColor(Color.white)
                }
                    .padding(.leading, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

                Spacer()
            }
                .padding(32)
                .background(
                    LinearGradient(
                        colors: [Color.init(hex: 0xbceac7), Color.init(hex: 0xdaf4e0)],
                        startPoint: .topTrailing,
                        endPoint: .bottomLeading
                    )
                )
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

            HStack {
                Text("理科")
                    .frame(height: 120, alignment: .topLeading)
                    .font(.system(size: 32))
                    .padding(.trailing, 64)
                
                NavigationLink(destination: router?.makeScienceStudyiew()) {
                    Text("日々の演習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient1)
                        .foregroundColor(Color.white)
                }
                    .padding(.trailing, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                
                NavigationLink(destination: router?.makeScienceTestView()) {
                    Text("日々のテスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(gradient2)
                        .foregroundColor(Color.white)
                }
                    .padding(.leading, 32)
                    .clipped()
                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
                
                Spacer()
            }
                .padding(32)
                .background(
                    LinearGradient(
                        colors: [Color.init(hex: 0xf4c9b0), Color.init(hex: 0xfbece4)],
                        startPoint: .topTrailing,
                        endPoint: .bottomLeading
                    )
                )
                .clipped()
                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)

            
            Spacer()
        }.padding(.horizontal, 64)
            .navigationBarTitleDisplayMode(.inline)
            .navigationBarColor(UIColor(Color.primaryColor), UIColor(Color.white))
            .toolbar {
                ToolbarItem(placement: .principal) {
                    Text("Home")
                        .font(.largeTitle.bold())
                        .accessibilityAddTraits(.isHeader)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button {
                        Auth.signOut()
                    } label: {
                        Text("Sign Out")
                            .frame(width: 120, height: 36, alignment: .center)
                            .foregroundColor(Color.black)
//                            .foregroundColor(Color.white)
//                            .background(Color.accent1)
                    }
                }
            }
    }
}

extension RootView {
    func configureView() -> some View {
        var view = self
        
        view.router = RootRouter()
        
        return view
    }
}


struct RootView_Previews: PreviewProvider {
    static var previews: some View {
        RootView()
.previewInterfaceOrientation(.landscapeLeft)
    }
}
