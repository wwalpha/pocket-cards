//
//  WeeklyRootView.swift
//  PocketCards
//
//  Created by macmini on 2022/04/24.
//
//

import SwiftUI

struct WeeklyRootView: View {
    var interactor: WeeklyRootBusinessLogic?
    var router: WeeklyRootRouter = .init()

    @ObservedObject var viewModel = WeeklyRootViewModel()

    var body: some View {
        VStack {
            HStack {
                NavigationLink(destination: router.makeTest(subject: viewModel.subject)) {
                    Text("実力テスト")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(Color.green)
                        .foregroundColor(Color.white)
                }.padding(16)

                NavigationLink(destination: router.makePractice(subject: viewModel.subject)) {
                    Text("反復練習")
                        .font(.system(size: 24, design: .default))
                        .fontWeight(.bold)
                        .frame(width: 200, height: 96, alignment: .center)
                        .background(Color.purple)
                        .foregroundColor(Color.white)
                }.padding(.leading, 32)
            }
        }
    }
}

extension WeeklyRootView: WeeklyRootDisplayLogic {}

extension WeeklyRootView {
    func configureView(subject: String) -> some View {
        var view = self
        let interactor = WeeklyRootInteractor()
        let presenter = WeeklyRootPresenter()

        view.interactor = interactor
        interactor.presenter = presenter
        presenter.view = view

        view.viewModel.subject = subject

        return view
    }
}

struct WeeklyRootView_Previews: PreviewProvider {
    static var previews: some View {
        WeeklyRootView()
            .previewInterfaceOrientation(.landscapeRight)
    }
}
