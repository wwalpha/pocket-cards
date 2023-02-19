//
//  RootView.swift
//  PocketCards
//
//  Created by macmini on 2022/03/07.
//

import AVFoundation
import Kingfisher
import SwiftUI

struct Test2UIView: View {
    private var router: RootRouter?

    var body: some View {
        let gradient1 = LinearGradient(
            colors: [Color(hex: 0x2193B0), Color(hex: 0x6DD5ED)],
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )
        let gradient2 = LinearGradient(
            colors: [Color(hex: 0xC21500), Color(hex: 0xFFC500)],
            startPoint: .topTrailing,
            endPoint: .bottomLeading
        )

        NavigationStack {
            HStack {
                Text("v0.9.11")
                    .navigationTitle("Home")
                    .toolbarBackground(Color.primaryColor, for: .navigationBar)
                    .toolbarBackground(.visible, for: .navigationBar)
            }.padding(0)

//            VStack(alignment: .leading, spacing: 32) {
//                Spacer()
//
//                HStack {
//                    Text("国語")
//                        .frame(height: 120, alignment: .topLeading)
//                        .font(.system(size: 32))
//                        .padding(.trailing, 64)
//
//                    NavigationLink(destination: router?.makeLanguageStudyiew()) {
//                        Text("日々の演習")
//                            .font(.system(size: 24, design: .default))
//                            .fontWeight(.bold)
//                            .frame(width: 200, height: 72, alignment: .center)
//                            .background(gradient1)
//                            .foregroundColor(Color.white)
//                    }
//                    .padding(.trailing, 32)
//                    .clipped()
//                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
//
//                    NavigationLink(destination: router?.makeLanguageTestView()) {
//                        Text("日々のテスト")
//                            .font(.system(size: 24, design: .default))
//                            .fontWeight(.bold)
//                            .frame(width: 200, height: 72, alignment: .center)
//                            .background(gradient2)
//                            .foregroundColor(Color.white)
//                    }
//                    .padding(.trailing, 32)
//                    .clipped()
//                    .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
//
//                    Spacer()
//                }
//                .padding(16)
//                .background(
//                    LinearGradient(
//                        colors: [Color(hex: 0xF2B0B7), Color(hex: 0xFAE3E5)],
//                        startPoint: .topTrailing,
//                        endPoint: .bottomLeading
//                    )
//                )
//                .clipped()
//                .shadow(color: Color.black.opacity(0.3), radius: 5, x: 5, y: 5)
//            }
//            .padding(.horizontal, 64)
        }
    }
}

extension Test2UIView {
    func configureView() -> some View {
        var view = self

        view.router = RootRouter()

        return view
    }
}

struct Test2UIView_Previews: PreviewProvider {
    static var previews: some View {
        Test2UIView()
            .previewInterfaceOrientation(.landscapeLeft)
    }
}
